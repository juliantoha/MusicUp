import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// Helper to create a test user
async function createTestPerformer() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const timestamp = Date.now();
  const email = `test-performer-${timestamp}@example.com`;
  const password = 'TestPassword123!';

  // Create user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) throw authError;

  // Create profile
  await supabase.from('profiles').insert({
    id: authData.user.id,
    email,
    full_name: 'Test Performer',
    role: 'performer',
  });

  return { email, password };
}

test.describe('Booking Flow', () => {
  test('should create a booking and show confirmation', async ({ page }) => {
    // Create test performer
    const { email, password } = await createTestPerformer();

    // Navigate to home
    await page.goto('/');

    // Login
    await page.click('text=/login|sign in/i');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for login to complete
    await page.waitForURL(/\/performer/, { timeout: 10000 });

    // Navigate to booking tab
    await page.click('text=/book.*concert/i');

    // Step 1: Choose venue
    await page.click('button[role="combobox"]');
    await page.click('text=/ivy park pleasanton/i');
    await page.click('text=/next|continue/i');

    // Step 2: Select concert
    await page.waitForSelector('text=/select.*concert/i');
    // Click the first available concert
    const firstConcert = page.locator('[role="radio"], [data-concert]').first();
    await firstConcert.click();
    await page.click('text=/next|continue/i');

    // Step 3: Pick piece
    await page.waitForSelector('text=/pick.*piece/i');

    // Select series
    await page.locator('select, [role="combobox"]').first().click();
    await page.click('text=/empathy/i');

    // Select collection
    await page.waitForTimeout(500);
    await page.locator('select, [role="combobox"]').nth(1).click();
    await page.click('text=/primary|secondary/i');

    // Select piece
    await page.waitForTimeout(500);
    await page.locator('select, [role="combobox"]').nth(2).click();
    await page.click('text=/arabesque|ballade/i');

    // Select stage
    await page.waitForTimeout(500);
    await page.locator('select, [role="combobox"]').nth(3).click();
    await page.click('text=/stage 1|beginner/i');

    // Submit booking
    await page.click('button[type="submit"], text=/book|confirm/i');

    // Wait for success message
    await expect(page.locator('text=/success|booked/i')).toBeVisible({ timeout: 5000 });

    // Navigate to "My Bookings" to verify
    await page.click('text=/my bookings|manage/i');

    // Verify booking appears
    await expect(page.locator('text=/ivy park|empathy/i')).toBeVisible();
  });

  test('should show validation error for incomplete booking', async ({ page }) => {
    // Create test performer
    const { email, password } = await createTestPerformer();

    // Navigate and login
    await page.goto('/');
    await page.click('text=/login|sign in/i');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/performer/, { timeout: 10000 });

    // Try to proceed without selecting venue
    await page.click('text=/book.*concert/i');
    await page.click('text=/next|continue/i');

    // Should show error
    await expect(page.locator('text=/select|choose|required/i')).toBeVisible();
  });
});
