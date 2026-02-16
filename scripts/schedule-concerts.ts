#!/usr/bin/env tsx

/**
 * MusicUp Concert Scheduling Script
 *
 * This script schedules specific concerts for Empathy Concerts series:
 * - Ivy Park at Pleasanton: Nov 8 & Dec 13, 2025 at 4:00-4:30 PM
 * - Oakmont of Silver Creek: Nov 8 & Dec 13, 2025 at 10:30-11:00 AM and 11:00-11:30 AM
 *
 * Usage: pnpm run schedule-concerts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Concert schedule
const CONCERTS = [
  // Ivy Park at Pleasanton
  {
    venueName: 'Ivy Park at Pleasanton',
    date: '2025-11-08',
    startTime: '16:00:00', // 4:00 PM
    endTime: '16:30:00',   // 4:30 PM
  },
  {
    venueName: 'Ivy Park at Pleasanton',
    date: '2025-12-13',
    startTime: '16:00:00', // 4:00 PM
    endTime: '16:30:00',   // 4:30 PM
  },
  // Oakmont of Silver Creek - November 8
  {
    venueName: 'Oakmont of Silver Creek',
    date: '2025-11-08',
    startTime: '10:30:00', // 10:30 AM
    endTime: '11:00:00',   // 11:00 AM
    notes: 'Back upright piano',
  },
  {
    venueName: 'Oakmont of Silver Creek',
    date: '2025-11-08',
    startTime: '11:00:00', // 11:00 AM
    endTime: '11:30:00',   // 11:30 AM
    notes: 'Main front grand piano',
  },
  // Oakmont of Silver Creek - December 13
  {
    venueName: 'Oakmont of Silver Creek',
    date: '2025-12-13',
    startTime: '10:30:00', // 10:30 AM
    endTime: '11:00:00',   // 11:00 AM
    notes: 'Back upright piano',
  },
  {
    venueName: 'Oakmont of Silver Creek',
    date: '2025-12-13',
    startTime: '11:00:00', // 11:00 AM
    endTime: '11:30:00',   // 11:30 AM
    notes: 'Main front grand piano',
  },
];

async function main() {
  console.log('🎭 Starting concert scheduling script...\n');

  try {
    // 1. Get Empathy series
    console.log('📚 Finding Empathy Concerts series...');
    const { data: series, error: seriesError } = await supabase
      .from('series')
      .select('*')
      .eq('name', 'empathy')
      .single();

    if (seriesError || !series) {
      console.error('❌ Empathy series not found. Please run update-empathy script first.');
      process.exit(1);
    }
    console.log(`✓ Found series: ${series.name} (${series.id})\n');

    // 2. Get venues
    console.log('🏛️  Finding venues...');
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('*')
      .in('name', ['Ivy Park at Pleasanton', 'Oakmont of Silver Creek']);

    if (venuesError || !venues || venues.length !== 2) {
      console.error('❌ Venues not found. Please run update-empathy script first.');
      process.exit(1);
    }
    console.log(`✓ Found ${venues.length} venues\n`);

    // Create a map of venue names to IDs
    const venueMap = new Map(venues.map(v => [v.name, v.id]));

    // 3. Delete existing scheduled concerts for these venues
    console.log('🗑️  Removing old scheduled concerts...');
    const venueIds = venues.map(v => v.id);
    const { error: deleteError } = await supabase
      .from('concerts')
      .delete()
      .in('venue_id', venueIds)
      .eq('status', 'scheduled');

    if (deleteError) {
      console.log('Note: No old concerts to delete or deletion failed');
    } else {
      console.log('✓ Removed old scheduled concerts\n');
    }

    // 4. Schedule new concerts
    console.log('🎭 Scheduling new concerts...');
    const concertsToInsert = CONCERTS.map(concert => ({
      series_id: series.id,
      venue_id: venueMap.get(concert.venueName),
      scheduled_date: concert.date,
      start_time: concert.startTime,
      end_time: concert.endTime,
      status: 'scheduled',
      notes: concert.notes || `${concert.venueName} Empathy Concert`,
    }));

    const { data: newConcerts, error: concertsError } = await supabase
      .from('concerts')
      .insert(concertsToInsert)
      .select();

    if (concertsError) throw concertsError;

    console.log(`✓ Scheduled ${newConcerts.length} concerts:\n`);

    // Group by venue for display
    const ivyPark = newConcerts.filter(c => venueMap.get('Ivy Park at Pleasanton') === c.venue_id);
    const oakmont = newConcerts.filter(c => venueMap.get('Oakmont of Silver Creek') === c.venue_id);

    console.log('📍 Ivy Park at Pleasanton:');
    ivyPark.forEach(concert => {
      console.log(`   - ${concert.scheduled_date} at ${concert.start_time} - ${concert.end_time}`);
    });

    console.log('\n📍 Oakmont of Silver Creek:');
    oakmont.forEach(concert => {
      const noteStr = concert.notes.includes('piano') ? ` (${concert.notes.split(' ').slice(-2).join(' ')})` : '';
      console.log(`   - ${concert.scheduled_date} at ${concert.start_time} - ${concert.end_time}${noteStr}`);
    });

    console.log('\n✅ Concert scheduling complete!\n');
    console.log('📊 Summary:');
    console.log(`  - Total concerts: ${newConcerts.length}`);
    console.log(`  - Ivy Park at Pleasanton: ${ivyPark.length} concerts`);
    console.log(`  - Oakmont of Silver Creek: ${oakmont.length} concerts`);
    console.log('\n🎉 Performers can now book these concerts at /performer\n');
  } catch (error) {
    console.error('\n❌ Concert scheduling failed:', error);
    process.exit(1);
  }
}

main();
