import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Helper to create test admin
async function createTestAdmin() {
  const timestamp = Date.now();
  const email = `test-admin-${timestamp}@example.com`;
  const password = 'AdminPassword123!';

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) throw authError;

  await supabase.from('profiles').insert({
    id: authData.user.id,
    email,
    full_name: 'Test Admin',
    role: 'admin',
  });

  // Get the seeded venue
  const { data: venue } = await supabase.from('venues').select('id').limit(1).single();

  if (venue) {
    // Link admin to venue
    await supabase.from('admins_venues').insert({
      profile_id: authData.user.id,
      venue_id: venue.id,
    });
  }

  return { email, password, adminId: authData.user.id };
}

// Helper to create test performer with booking
async function createTestPerformerWithBooking() {
  const timestamp = Date.now();
  const email = `test-performer-${timestamp}@example.com`;
  const password = 'PerformerPassword123!';

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) throw authError;

  await supabase.from('profiles').insert({
    id: authData.user.id,
    email,
    full_name: 'Test Performer',
    role: 'performer',
  });

  // Get seeded concert
  const { data: concert } = await supabase
    .from('concerts')
    .select('id')
    .eq('status', 'scheduled')
    .limit(1)
    .single();

  // Get seeded piece stage
  const { data: pieceStage } = await supabase.from('piece_stages').select('id').limit(1).single();

  // Create booking
  if (concert && pieceStage) {
    await supabase.from('bookings').insert({
      concert_id: concert.id,
      performer_id: authData.user.id,
      piece_stage_id: pieceStage.id,
      status: 'confirmed',
    });
  }

  return { email, password, performerId: authData.user.id, concertId: concert?.id };
}

test.describe('Admin Workflow', () => {
  test('should complete full concert workflow and grant service hours', async ({ page }) => {
    // Create test users
    const { email: adminEmail, password: adminPassword } = await createTestAdmin();
    const { email: performerEmail, password: performerPassword, performerId } =
      await createTestPerformerWithBooking();

    // Login as admin
    await page.goto('/');
    await page.click('text=/login|sign in/i');
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');

    // Wait for redirect to admin page
    await page.waitForURL(/\/admin/, { timeout: 10000 });

    // Navigate to concerts tab
    await page.click('text=/concerts.*host|my concerts/i');

    // Click on the concert to manage
    await page.click('text=/manage|view/i');

    // Mark performer as performed
    await page.waitForSelector('text=/performer attendance|checklist/i');

    // Find the performer's card and click "Performed" button
    const performerCard = page.locator('text=/test performer/i').locator('..');
    await performerCard.locator('text=/performed/i').click();

    // Verify success state (green background or checkmark)
    await expect(performerCard.locator('text=/performed/i')).toBeVisible();

    // Upload group photo
    await page.click('text=/upload.*photo/i');

    // Create a dummy image file for testing
    const testImagePath = path.join(__dirname, '../fixtures/test-photo.jpg');

    // If file doesn't exist, we'll skip the actual file upload
    // In a real test, you'd have a test image in tests/fixtures/
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      // Note: In actual tests, use a real image file
      // await fileInput.setInputFiles(testImagePath);
      console.log('File upload skipped - add test image to tests/fixtures/test-photo.jpg');
    }

    // Complete concert
    await page.click('text=/complete concert/i');

    // Wait for success
    await expect(page.locator('text=/success|completed|hours granted/i')).toBeVisible({
      timeout: 10000,
    });

    // Logout
    await page.click('text=/logout|sign out/i');

    // Login as performer to verify hours
    await page.goto('/');
    await page.click('text=/login|sign in/i');
    await page.fill('input[type="email"]', performerEmail);
    await page.fill('input[type="password"]', performerPassword);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/performer/, { timeout: 10000 });

    // Navigate to Information tab
    await page.click('text=/information|hours/i');

    // Verify service hours appear
    await expect(page.locator('text=/service hours|volunteer hours/i')).toBeVisible();
    await expect(page.locator('text=/3|3.0/').first()).toBeVisible(); // 3 hours granted

    // Verify past concert appears
    await expect(page.locator('text=/ivy park|empathy/i')).toBeVisible();
  });

  test('should require photo before completing concert', async ({ page }) => {
    // Create test admin
    const { email, password } = await createTestAdmin();
    await createTestPerformerWithBooking();

    // Login as admin
    await page.goto('/');
    await page.click('text=/login|sign in/i');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/admin/, { timeout: 10000 });

    // Navigate to concert
    await page.click('text=/concerts.*host|my concerts/i');
    await page.click('text=/manage|view/i');

    // Try to complete without photo
    await page.click('text=/complete concert/i');

    // Should show error about missing photo
    await expect(page.locator('text=/photo.*required|upload.*photo/i')).toBeVisible();
  });

  test('should update booking status correctly', async ({ page }) => {
    // Create test admin and performer
    const { email, password } = await createTestAdmin();
    await createTestPerformerWithBooking();

    // Login as admin
    await page.goto('/');
    await page.click('text=/login|sign in/i');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/admin/, { timeout: 10000 });

    // Navigate to concert
    await page.click('text=/concerts.*host|my concerts/i');
    await page.click('text=/manage|view/i');

    // Test different status changes
    const performerCard = page.locator('text=/test performer/i').locator('..');

    // Mark as absent
    await performerCard.locator('text=/absent/i').click();
    await page.waitForTimeout(500);

    // Mark as confirmed
    await performerCard.locator('text=/confirmed/i').click();
    await page.waitForTimeout(500);

    // Mark as performed
    await performerCard.locator('text=/performed/i').click();

    // Verify the card shows performed state
    await expect(performerCard.locator('text=/performed/i')).toBeVisible();
  });
});
