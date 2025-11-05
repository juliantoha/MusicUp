# E2E Tests Quick Start

## First Time Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install --with-deps chromium
```

### 3. Configure Environment
Ensure `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### 4. Seed Database
```bash
pnpm run seed
```

## Running Tests

### Quick Run (Headless)
```bash
pnpm test:e2e
```

### Visual Mode (Recommended)
```bash
pnpm test:e2e:ui
```

### Watch Tests Run
```bash
pnpm test:e2e:headed
```

## What Gets Tested

1. **Signup Flow** - User registration
2. **Booking Flow** - Performer books concert
3. **Admin Workflow** - Complete concert, grant hours

## Expected Results

All tests should pass:
```
✅ signup.spec.ts (2 tests)
✅ booking.spec.ts (2 tests)
✅ admin.spec.ts (3 tests)

Total: 7 tests passed
Time: ~40-60 seconds
```

## Troubleshooting

**Tests fail?**
- Run `pnpm run seed` to reset database
- Check `.env.local` has all required variables
- Ensure no dev server is running on port 3000

**Need help?**
See full documentation in `tests/README.md`
