# MusicUp Deployment Guide

Complete checklist for deploying MusicUp to Vercel with Supabase.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Supabase Setup](#supabase-setup)
3. [Vercel Deployment](#vercel-deployment)
4. [Environment Variables](#environment-variables)
5. [CRON Jobs Setup](#cron-jobs-setup)
6. [Security Verification](#security-verification)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Smoke Test Checklist](#smoke-test-checklist)

---

## Pre-Deployment Checklist

### Code Preparation
- [ ] All tests pass locally (`pnpm test:e2e`)
- [ ] Build succeeds locally (`pnpm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] All dependencies are up to date
- [ ] `.env.local.example` is updated with all required variables
- [ ] Git repository is clean (all changes committed)

### Database Preparation
- [ ] All migrations are tested locally
- [ ] Seed script runs successfully (`pnpm run seed`)
- [ ] Database schema is documented
- [ ] RLS policies are verified and tested

---

## Supabase Setup

### 1. Create Supabase Project

```bash
# Option 1: Via Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details:
   - Name: MusicUp Production
   - Database Password: [Generate strong password]
   - Region: Choose closest to your users
4. Wait for project to provision (~2 minutes)
```

### 2. Run Database Migrations

#### Option A: Using Supabase Dashboard (Recommended)

1. Navigate to **SQL Editor** in Supabase Dashboard
2. Run migrations in order:

**Migration 1: Initial Schema** (`sql/001_init.sql`)
```sql
-- Copy entire contents of sql/001_init.sql
-- Paste into SQL Editor
-- Click "Run"
```

**Migration 2: Seed Data** (`sql/002_seed.sql`)
```sql
-- Copy entire contents of sql/002_seed.sql
-- Paste into SQL Editor
-- Click "Run"
```

**Migration 3: Booking Updates** (`sql/003_add_booking_updated_at.sql`)
```sql
-- Copy entire contents of sql/003_add_booking_updated_at.sql
-- Paste into SQL Editor
-- Click "Run"
```

3. Verify tables were created:
   - Go to **Table Editor**
   - Confirm all tables exist: profiles, venues, series, collections, pieces, piece_stages, concerts, bookings, etc.

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push

# Or run individual migrations
supabase db execute --file sql/001_init.sql
supabase db execute --file sql/002_seed.sql
supabase db execute --file sql/003_add_booking_updated_at.sql
```

### 3. Configure Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Verify buckets exist (should be created by migration):
   - `scores`
   - `audio`
   - `concert_photos`
3. If not created, create them manually with public access

### 4. Set Up Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates (optional):
   - **Confirm signup**: Customize welcome email
   - **Magic Link**: Customize login email
4. Set **Site URL**: `https://your-domain.vercel.app`
5. Add **Redirect URLs**:
   - `https://your-domain.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

### 5. Collect API Keys

Go to **Settings** > **API** and save these values:

- [ ] `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **NEVER expose publicly**

---

## Vercel Deployment

### 1. Connect Repository

```bash
# Option 1: Via Vercel Dashboard
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"
```

### 2. Configure Build Settings

In Vercel project settings:

**Framework Preset**: Next.js
**Build Command**: `pnpm run build`
**Output Directory**: `.next`
**Install Command**: `pnpm install`
**Node Version**: 20.x

### 3. Set Environment Variables

Go to **Settings** > **Environment Variables**

Add the following variables for **Production**, **Preview**, and **Development**:

#### Public Variables (Safe to expose)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Secret Variables (Server-side only) ⚠️
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
RESEND_API_KEY=your-resend-api-key-here
```

**Important**:
- Mark `SUPABASE_SERVICE_ROLE_KEY` as **Production** only initially
- Only add to Preview/Development if needed for specific features
- Never log or expose this key in client-side code

### 4. Deploy

```bash
# Automatic deployment
git push origin main

# Or deploy specific branch
vercel --prod
```

Wait for deployment to complete (~2-5 minutes).

---

## Environment Variables

### Complete Environment Variable Mapping

| Variable | Source | Vercel Environment | Required | Notes |
|----------|--------|-------------------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings > API > Project URL | All | Yes | Public - safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings > API > anon public | All | Yes | Public - safe to expose |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings > API > service_role secret | Production only | Yes | **Secret - server-side only** |
| `RESEND_API_KEY` | Resend Dashboard | Production | Yes | For email notifications |
| `BASE_URL` | Your domain | Production | Optional | E.g., `https://musicup.vercel.app` |

### Verification Script

Create a file to verify environment variables are set correctly:

```typescript
// scripts/verify-env.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

const serverOnlyEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
];

let hasErrors = false;

// Check public vars
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing: ${varName}`);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName} is set`);
  }
});

// Check server vars (only check, don't log values)
serverOnlyEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing: ${varName}`);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName} is set (server-side)`);
  }
});

if (hasErrors) {
  process.exit(1);
}

console.log('\n✅ All environment variables are configured correctly');
```

Run before deployment:
```bash
tsx scripts/verify-env.ts
```

---

## CRON Jobs Setup

### 1. Vercel CRON Configuration

Create `vercel.json` in project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/concert-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**Schedule**: Daily at 9:00 AM UTC
**Endpoint**: `/api/cron/concert-reminders`

### 2. Verify CRON Endpoint

The API route should already exist at:
`src/app/api/cron/concert-reminders/route.ts`

This sends reminder emails 24 hours before concerts.

### 3. Secure CRON Endpoint

Add verification token to prevent unauthorized access:

```typescript
// src/app/api/cron/concert-reminders/route.ts
export async function GET(request: Request) {
  // Verify CRON secret (Vercel sets this automatically)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Your existing code...
}
```

Add `CRON_SECRET` to Vercel environment variables:
```
CRON_SECRET=your-random-secret-here
```

### 4. Test CRON Job

```bash
# After deployment, manually trigger:
curl -X GET https://your-domain.vercel.app/api/cron/concert-reminders \
  -H "Authorization: Bearer your-cron-secret"
```

### 5. Monitor CRON Jobs

1. Go to **Vercel Dashboard** > **Your Project** > **Cron Jobs**
2. View execution logs
3. Check for errors or failures
4. Verify emails are being sent

---

## Security Verification

### Server-Side Only Keys Checklist

Verify `SUPABASE_SERVICE_ROLE_KEY` is used **ONLY** server-side:

- [ ] Check all server actions use `createClient()` from `src/lib/supabase/server.ts`
- [ ] Verify no client components import or use service role key
- [ ] Confirm API routes properly authenticate before using admin operations
- [ ] Ensure seed script only runs locally (not in production)
- [ ] Verify CRON endpoints are protected with authorization

### Code Audit

Search codebase for potential leaks:

```bash
# Search for service role key usage
grep -r "SERVICE_ROLE_KEY" --exclude-dir=node_modules

# Should only appear in:
# - .env.local.example (as template)
# - scripts/seed.ts (local only)
# - Server-side code (server.ts, API routes)
# - Test files (tests/e2e/*.spec.ts)
```

### Environment Variable Protection

- [ ] Service role key is NOT in `.env.local.example`
- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets committed to Git history
- [ ] Vercel environment variables are encrypted
- [ ] Different keys for production vs. preview/development

### RLS Policies Verification

Test Row Level Security in Supabase:

1. Go to **SQL Editor**
2. Run test queries as different users
3. Verify policies block unauthorized access:

```sql
-- Test as anonymous user (should fail)
SELECT * FROM profiles;

-- Test as authenticated user (should only see own profile)
SELECT * FROM profiles WHERE id = auth.uid();
```

---

## Post-Deployment Verification

### 1. Basic Health Checks

- [ ] Site loads: Visit `https://your-domain.vercel.app`
- [ ] No console errors in browser
- [ ] All static assets load (images, fonts, styles)
- [ ] Navigation works (all pages load)

### 2. Authentication Flow

- [ ] Signup page loads
- [ ] Can create new account
- [ ] Email confirmation works (check inbox)
- [ ] Can log in with credentials
- [ ] Can log out
- [ ] Protected routes redirect to login

### 3. Database Connectivity

- [ ] Data loads from Supabase (venues, series, concerts)
- [ ] Can create new records (bookings)
- [ ] Updates work (edit booking)
- [ ] Deletes work (cancel booking)
- [ ] RLS policies are enforced

### 4. File Storage

- [ ] Can upload files (concert photos)
- [ ] Files are accessible via signed URLs
- [ ] Public files load correctly
- [ ] Storage quotas are configured

### 5. Email Notifications

- [ ] Booking confirmation emails send
- [ ] Concert reminder emails send (test CRON)
- [ ] Email templates render correctly
- [ ] Unsubscribe links work (if implemented)

---

## Smoke Test Checklist

### Automated Smoke Tests

Create a post-deploy smoke test script:

```typescript
// scripts/smoke-test.ts
/**
 * Post-deployment smoke tests
 * Run after deploying to verify critical functionality
 */

import { createClient } from '@supabase/supabase-js';

const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL || 'https://your-domain.vercel.app';

async function runSmokeTests() {
  console.log('🔥 Running smoke tests...\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: [] as Array<{ name: string; status: 'PASS' | 'FAIL'; message?: string }>,
  };

  // Test 1: Homepage loads
  try {
    const response = await fetch(DEPLOYMENT_URL);
    if (response.ok) {
      results.passed++;
      results.tests.push({ name: 'Homepage loads', status: 'PASS' });
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    results.failed++;
    results.tests.push({
      name: 'Homepage loads',
      status: 'FAIL',
      message: String(error),
    });
  }

  // Test 2: Supabase connection
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.from('venues').select('count').single();

    if (!error) {
      results.passed++;
      results.tests.push({ name: 'Supabase connectivity', status: 'PASS' });
    } else {
      throw error;
    }
  } catch (error) {
    results.failed++;
    results.tests.push({
      name: 'Supabase connectivity',
      status: 'FAIL',
      message: String(error),
    });
  }

  // Test 3: API routes work
  try {
    const response = await fetch(`${DEPLOYMENT_URL}/api/health`);
    if (response.ok) {
      results.passed++;
      results.tests.push({ name: 'API routes respond', status: 'PASS' });
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    results.failed++;
    results.tests.push({
      name: 'API routes respond',
      status: 'FAIL',
      message: String(error),
    });
  }

  // Print results
  console.log('📊 Test Results:\n');
  results.tests.forEach((test) => {
    const icon = test.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${test.name}`);
    if (test.message) {
      console.log(`   ${test.message}`);
    }
  });

  console.log(`\n${results.passed} passed, ${results.failed} failed`);

  if (results.failed > 0) {
    process.exit(1);
  }
}

runSmokeTests();
```

Run smoke tests:
```bash
DEPLOYMENT_URL=https://your-domain.vercel.app tsx scripts/smoke-test.ts
```

### Manual Smoke Test Checklist

Run through these scenarios after deployment:

#### 🎭 Performer Flow
- [ ] Navigate to `/performer`
- [ ] View "Book a Concert" tab
- [ ] Select venue: Ivy Park Pleasanton
- [ ] Select upcoming concert
- [ ] Choose piece from empathy series
- [ ] Select difficulty stage
- [ ] Submit booking
- [ ] Verify confirmation message
- [ ] Check "My Bookings" shows new booking
- [ ] Navigate to "Information" tab
- [ ] Verify service hours display (if any)

#### 👨‍💼 Admin Flow
- [ ] Log in as admin
- [ ] Navigate to `/admin`
- [ ] View "Concerts I Host" tab
- [ ] Click on upcoming concert
- [ ] View performer attendance checklist
- [ ] Mark performer as "Performed"
- [ ] Upload concert photo
- [ ] Complete concert
- [ ] Verify success message
- [ ] Check service hours were granted

#### 📧 Email Flow
- [ ] Create new performer account
- [ ] Book a concert
- [ ] Check email for booking confirmation
- [ ] Wait for CRON job (or manually trigger)
- [ ] Check email for concert reminder (24h before)

#### 🔒 Security Flow
- [ ] Try accessing `/admin` as performer → should redirect
- [ ] Try accessing protected API routes without auth → should return 401
- [ ] Verify service role key not exposed in browser network tab
- [ ] Check RLS policies block unauthorized data access

### Performance Checks

- [ ] Lighthouse score > 90 for Performance
- [ ] Lighthouse score > 90 for Accessibility
- [ ] Time to Interactive < 3 seconds
- [ ] First Contentful Paint < 1.5 seconds
- [ ] No console errors or warnings

---

## Rollback Plan

If deployment fails or critical issues arise:

### 1. Immediate Rollback

```bash
# Via Vercel Dashboard
1. Go to Deployments
2. Find last working deployment
3. Click "..." menu
4. Select "Promote to Production"
```

### 2. Database Rollback

If migrations caused issues:

```sql
-- Revert migration (example)
DROP TABLE IF EXISTS new_table;
ALTER TABLE bookings DROP COLUMN IF EXISTS updated_at;
```

### 3. Environment Variable Rollback

1. Go to Vercel Settings > Environment Variables
2. Restore previous values
3. Redeploy

---

## Maintenance

### Regular Checks (Weekly)

- [ ] Review Vercel deployment logs for errors
- [ ] Check CRON job execution logs
- [ ] Monitor email delivery rates (Resend dashboard)
- [ ] Review Supabase database size and usage
- [ ] Check for failed authentication attempts
- [ ] Verify storage bucket usage

### Updates (Monthly)

- [ ] Update dependencies: `pnpm update`
- [ ] Review and apply security patches
- [ ] Backup database (Supabase automatic backups)
- [ ] Review and optimize database queries
- [ ] Check for deprecated features

---

## Support & Resources

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### Monitoring
- **Vercel**: Dashboard > Analytics
- **Supabase**: Dashboard > Database > Logs
- **Resend**: Dashboard > Logs

### Troubleshooting

**Issue**: Build fails on Vercel
- Check build logs for specific error
- Verify all dependencies are in `package.json`
- Test build locally: `pnpm run build`

**Issue**: Environment variables not working
- Verify variables are set for correct environment (Production/Preview/Development)
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

**Issue**: Database connection fails
- Verify Supabase project is running
- Check API keys are correct
- Ensure RLS policies allow access

**Issue**: CRON job not running
- Verify `vercel.json` is committed
- Check CRON schedule syntax
- View CRON logs in Vercel dashboard
- Ensure endpoint responds with 200 status

---

## Deployment Checklist Summary

### Pre-Deployment
- [x] Code tested and built successfully
- [x] All migrations ready
- [x] Environment variables documented

### Supabase Setup
- [ ] Project created
- [ ] Migrations run
- [ ] Storage configured
- [ ] Auth configured
- [ ] API keys collected

### Vercel Setup
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Domain configured (optional)

### Post-Deployment
- [ ] Site loads successfully
- [ ] Database connectivity verified
- [ ] Authentication works
- [ ] CRON jobs configured and tested
- [ ] Smoke tests pass
- [ ] Security audit complete

### Go Live
- [ ] All checks passed
- [ ] Monitoring configured
- [ ] Team notified
- [ ] Documentation updated

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Production URL**: _____________
**Supabase Project**: _____________

🎉 **Deployment Complete!**
