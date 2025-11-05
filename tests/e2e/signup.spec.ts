import { test, expect } from '@playwright/test';

test.describe('Signup Flow', () => {
  test('should allow user to sign up successfully', async ({ page }) => {
    // Generate unique email for this test run
    const timestamp = Date.now();
    const testEmail = `test-performer-${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';

    // Navigate to signup page
    await page.goto('/');

    // Look for signup link or button
    const signupButton = page.getByRole('link', { name: /sign up/i });
    if (await signupButton.isVisible()) {
      await signupButton.click();
    }

    // Fill in signup form
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for success (redirect or message)
    // This assumes signup redirects to a dashboard or shows success message
    await page.waitForURL(/\/(performer|admin|dashboard)/, { timeout: 10000 });

    // Verify we're logged in
    const isLoggedIn = await page.locator('text=/logout|sign out/i').isVisible();
    expect(isLoggedIn).toBeTruthy();
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.goto('/');

    // Navigate to signup
    const signupButton = page.getByRole('link', { name: /sign up/i });
    if (await signupButton.isVisible()) {
      await signupButton.click();
    }

    // Try invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'TestPassword123!');

    // Submit should fail
    await page.click('button[type="submit"]');

    // Check for error message
    const errorVisible = await page.locator('text=/invalid|error/i').isVisible();
    expect(errorVisible).toBeTruthy();
  });
});
