# MusicUp E2E Tests

## Overview
End-to-end tests using Playwright to verify critical user flows in the MusicUp application.

## Test Coverage

### 1. Signup Flow (`signup.spec.ts`)
- ✅ User can sign up with valid credentials
- ✅ Invalid email shows error
- ✅ Successful signup redirects to dashboard

### 2. Booking Flow (`booking.spec.ts`)
- ✅ Performer can create a booking
- ✅ Booking confirmation appears
- ✅ Booking appears in "My Bookings"
- ✅ Validation errors for incomplete booking

### 3. Admin Workflow (`admin.spec.ts`)
- ✅ Admin can mark performer as performed
- ✅ Admin can upload group photo
- ✅ Admin can complete concert
- ✅ Service hours appear for performer after completion
- ✅ Photo required before completing concert
- ✅ Booking status updates correctly

## Prerequisites

### 1. Install Dependencies
```bash
pnpm install
npx playwright install --with-deps chromium
```

This installs:
- `@playwright/test` - Playwright testing framework
- Chromium browser for running tests

### 2. Environment Setup
Ensure `.env.local` contains:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Required for test setup
```

### 3. Seed Database
Before running tests, seed the database with test data:
```bash
pnpm run seed
```

This creates:
- Series: "empathy"
- Venue: Ivy Park Pleasanton
- Collections and pieces
- Upcoming concerts

## Running Tests

### Run All Tests (Headless)
```bash
pnpm test:e2e
```

### Run with UI Mode (Recommended for Development)
```bash
pnpm test:e2e:ui
```

Benefits of UI mode:
- Visual test runner
- Step-by-step execution
- Time travel debugging
- Screenshots and videos

### Run Tests in Headed Mode
```bash
pnpm test:e2e:headed
```

Watch tests run in a real browser window.

### Debug a Specific Test
```bash
pnpm test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### Run Specific Test File
```bash
pnpm test:e2e tests/e2e/signup.spec.ts
```

### Run Specific Test
```bash
pnpm test:e2e -g "should create a booking"
```

## Test Output

### HTML Report
After running tests, view the HTML report:
```bash
npx playwright show-report
```

Contains:
- Test results
- Screenshots on failure
- Videos on failure
- Execution traces

### CI/CD
Tests automatically:
- Run in headless mode
- Retry failed tests 2 times
- Generate HTML report artifact

## Test Structure

### Test Organization
```
tests/
├── e2e/
│   ├── signup.spec.ts     # User registration tests
│   ├── booking.spec.ts    # Performer booking tests
│   └── admin.spec.ts      # Admin workflow tests
├── fixtures/
│   └── .gitkeep           # Test images and files
└── README.md              # This file
```

### Helper Functions

Tests include helper functions for common operations:

**`createTestPerformer()`** - Creates a test performer account
```typescript
const { email, password } = await createTestPerformer();
```

**`createTestAdmin()`** - Creates a test admin account
```typescript
const { email, password } = await createTestAdmin();
```

**`createTestPerformerWithBooking()`** - Creates performer with existing booking
```typescript
const { email, password, concertId } = await createTestPerformerWithBooking();
```

## Writing New Tests

### Basic Test Template
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Navigate
    await page.goto('/');

    // Interact
    await page.click('button');

    // Assert
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### Best Practices

1. **Use Semantic Locators**
   ```typescript
   // Good
   await page.getByRole('button', { name: /submit/i });
   await page.getByLabel('Email');

   // Avoid
   await page.click('.submit-btn');
   ```

2. **Wait for Network Idle**
   ```typescript
   await page.waitForURL(/\/dashboard/);
   await expect(page.locator('text=Welcome')).toBeVisible();
   ```

3. **Use Unique Test Data**
   ```typescript
   const timestamp = Date.now();
   const email = `test-${timestamp}@example.com`;
   ```

4. **Clean Up After Tests**
   - Tests create unique users for each run
   - Database should be reset between full test runs
   - Use `pnpm run seed` to reset to clean state

## Common Issues

### Issue: Tests Fail Due to Missing Data
**Solution**: Run `pnpm run seed` before tests

### Issue: Port Already in Use
**Solution**: Kill existing dev server or change port in `playwright.config.ts`

### Issue: Authentication Errors
**Solution**: Verify `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

### Issue: Slow Tests
**Solution**:
- Run fewer tests: `pnpm test:e2e signup.spec.ts`
- Use UI mode for targeted testing
- Ensure no other heavy processes running

## Debugging Tests

### 1. Use Playwright Inspector
```bash
pnpm test:e2e:debug
```

Step through tests line by line.

### 2. Use Console Logs
```typescript
test('my test', async ({ page }) => {
  page.on('console', msg => console.log(msg.text()));
  // Your test code
});
```

### 3. Take Screenshots
```typescript
await page.screenshot({ path: 'debug.png' });
```

### 4. Slow Down Execution
```typescript
test.use({ slowMo: 1000 }); // 1 second delay between actions
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: pnpm install
      - run: pnpm run seed
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Data Management

### Before Each Test Run
1. Seed database: `pnpm run seed`
2. Verify dev server is not running
3. Ensure `.env.local` is configured

### After Tests
- Test users are created with unique timestamps
- No cleanup required between runs
- Full database reset: Re-run seed script

## Performance

### Test Execution Times
- **Signup Flow**: ~5-10 seconds
- **Booking Flow**: ~15-20 seconds
- **Admin Workflow**: ~20-30 seconds
- **Total Suite**: ~40-60 seconds

### Optimization Tips
1. Run tests serially (`workers: 1` in config)
2. Use `test.describe.serial()` for dependent tests
3. Cache authentication state for faster logins
4. Mock external services when possible

## Coverage Goals

### Current Coverage
- ✅ User authentication (signup/login)
- ✅ Performer booking flow
- ✅ Admin concert management
- ✅ Service hours tracking

### Future Tests
- [ ] Edit booking flow
- [ ] Cancel booking flow
- [ ] Library upload (admin)
- [ ] CSV export
- [ ] Email notifications
- [ ] Super admin dashboard

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)
- [Test Selectors](https://playwright.dev/docs/selectors)

## Acceptance Criteria

✅ `pnpm test:e2e` runs green locally with seeded DB
✅ All three test suites pass
✅ Tests run in under 60 seconds
✅ No flaky tests (consistent passes)
✅ Clear error messages on failure
✅ HTML report generated with screenshots/videos
