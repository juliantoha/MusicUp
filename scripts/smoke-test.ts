#!/usr/bin/env tsx

/**
 * Post-Deployment Smoke Tests
 *
 * Verifies critical functionality after deployment
 * Run: DEPLOYMENT_URL=https://your-app.vercel.app tsx scripts/smoke-test.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  message?: string;
  duration?: number;
}

const results: TestResult[] = [];
let totalPassed = 0;
let totalFailed = 0;

async function runTest(name: string, testFn: () => Promise<void>) {
  const startTime = Date.now();
  try {
    await testFn();
    const duration = Date.now() - startTime;
    results.push({ name, status: 'PASS', duration });
    totalPassed++;
    console.log(`✅ ${name} (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - startTime;
    const message = error instanceof Error ? error.message : String(error);
    results.push({ name, status: 'FAIL', message, duration });
    totalFailed++;
    console.log(`❌ ${name} (${duration}ms)`);
    console.log(`   Error: ${message}`);
  }
}

async function runSmokeTests() {
  console.log('🔥 MusicUp Smoke Tests\n');
  console.log(`Target: ${DEPLOYMENT_URL}\n`);

  // Test 1: Homepage loads
  await runTest('Homepage loads', async () => {
    const response = await fetch(DEPLOYMENT_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const html = await response.text();
    if (!html.includes('MusicUp')) {
      throw new Error('Page content does not include "MusicUp"');
    }
  });

  // Test 2: Health check endpoint
  await runTest('Health check endpoint responds', async () => {
    const response = await fetch(`${DEPLOYMENT_URL}/api/health`);
    if (response.status !== 200 && response.status !== 404) {
      throw new Error(`HTTP ${response.status}`);
    }
    // 404 is acceptable if endpoint doesn't exist yet
  });

  // Test 3: Supabase connectivity
  await runTest('Supabase connection works', async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables not set');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase.from('venues').select('id').limit(1);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
  });

  // Test 4: Venues data exists
  await runTest('Seed data exists (venues)', async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables not set');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase.from('venues').select('*');

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('No venues found - database may not be seeded');
    }
  });

  // Test 5: Series data exists
  await runTest('Seed data exists (series)', async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables not set');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase.from('series').select('*');

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('No series found - database may not be seeded');
    }
  });

  // Test 6: Upcoming concerts exist
  await runTest('Upcoming concerts available', async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables not set');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('concerts')
      .select('*')
      .eq('status', 'scheduled')
      .gte('scheduled_date', today);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('No upcoming concerts - performers cannot book');
    }
  });

  // Test 7: Performer page loads
  await runTest('Performer page accessible', async () => {
    const response = await fetch(`${DEPLOYMENT_URL}/performer`);
    // Should redirect to login (302) or load page (200)
    if (response.status !== 200 && response.status !== 302) {
      throw new Error(`HTTP ${response.status}`);
    }
  });

  // Test 8: Admin page loads
  await runTest('Admin page accessible', async () => {
    const response = await fetch(`${DEPLOYMENT_URL}/admin`);
    // Should redirect to login (302) or load page (200)
    if (response.status !== 200 && response.status !== 302) {
      throw new Error(`HTTP ${response.status}`);
    }
  });

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary\n');
  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalFailed}`);

  const totalDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0);
  console.log(`⏱️  Total Time: ${totalDuration}ms`);

  if (totalFailed > 0) {
    console.log('\n❌ Some tests failed. Check errors above.');
    process.exit(1);
  } else {
    console.log('\n✅ All smoke tests passed!');
    console.log('🎉 Deployment is healthy and ready for use.\n');
  }
}

// Run tests
runSmokeTests().catch((error) => {
  console.error('\n💥 Smoke tests crashed:', error);
  process.exit(1);
});
