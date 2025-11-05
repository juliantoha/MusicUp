#!/usr/bin/env tsx

/**
 * MusicUp Seed Data Script
 *
 * This script populates the database with test data including:
 * - Series: "empathy"
 * - Venue: "Ivy Park Pleasanton"
 * - Collections: 1 primary + 1 secondary (12 pieces each)
 * - Piece stages: 3 stages per piece with placeholder paths
 * - Concerts: 2 upcoming concerts in the next 30 days
 *
 * Usage: pnpm run seed
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

// Seed data constants
const SERIES_NAME = 'empathy';
const VENUE_DATA = {
  name: 'Ivy Park Pleasanton',
  address: '4860 Bernal Ave',
  city: 'Pleasanton',
  state: 'CA',
  zip: '94566',
  contact_email: 'info@ivypark.org',
};

const PIECE_NAMES = [
  'Arabesque',
  'Ballade',
  'Caprice',
  'Divertimento',
  'Étude',
  'Fantasia',
  'Gavotte',
  'Humoresque',
  'Impromptu',
  'Jig',
  'Krakowiak',
  'Lullaby',
];

async function main() {
  console.log('🌱 Starting seed script...\n');

  try {
    // 1. Create Series
    console.log('📚 Creating series...');
    const { data: series, error: seriesError } = await supabase
      .from('series')
      .insert({ name: SERIES_NAME, description: 'Empathy music series for young performers' })
      .select()
      .single();

    if (seriesError) throw seriesError;
    console.log(`✓ Created series: ${series.name} (${series.id})\n`);

    // 2. Create Venue
    console.log('🏛️  Creating venue...');
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .insert(VENUE_DATA)
      .select()
      .single();

    if (venueError) throw venueError;
    console.log(`✓ Created venue: ${venue.name} (${venue.id})\n`);

    // 3. Create Collections
    console.log('📦 Creating collections...');
    const { data: collections, error: collectionsError } = await supabase
      .from('collections')
      .insert([
        {
          series_id: series.id,
          name: 'Primary Collection',
          description: 'Main collection of pieces',
          display_order: 1,
        },
        {
          series_id: series.id,
          name: 'Secondary Collection',
          description: 'Additional collection of pieces',
          display_order: 2,
        },
      ])
      .select();

    if (collectionsError) throw collectionsError;
    console.log(`✓ Created ${collections.length} collections\n`);

    // 4. Create Pieces (12 per collection)
    console.log('🎵 Creating pieces...');
    const piecesToInsert = [];

    for (const collection of collections) {
      for (let i = 0; i < 12; i++) {
        piecesToInsert.push({
          collection_id: collection.id,
          title: PIECE_NAMES[i],
          composer: 'Various',
          year_composed: 2020 + (i % 5),
          display_order: i + 1,
        });
      }
    }

    const { data: pieces, error: piecesError } = await supabase
      .from('pieces')
      .insert(piecesToInsert)
      .select();

    if (piecesError) throw piecesError;
    console.log(`✓ Created ${pieces.length} pieces\n`);

    // 5. Create Piece Stages (3 per piece)
    console.log('🎼 Creating piece stages...');
    const stagesToInsert = [];

    for (const piece of pieces) {
      for (let stage = 1; stage <= 3; stage++) {
        stagesToInsert.push({
          piece_id: piece.id,
          stage,
          score_url: `https://placeholder.com/scores/${piece.title.toLowerCase()}_stage${stage}.pdf`,
          audio_url: `https://placeholder.com/audio/${piece.title.toLowerCase()}_stage${stage}.mp3`,
          notes: `Stage ${stage} difficulty level`,
        });
      }
    }

    const { data: stages, error: stagesError } = await supabase
      .from('piece_stages')
      .insert(stagesToInsert)
      .select();

    if (stagesError) throw stagesError;
    console.log(`✓ Created ${stages.length} piece stages\n`);

    // 6. Create Concerts (2 in the next 30 days)
    console.log('🎭 Creating concerts...');
    const now = new Date();
    const concert1Date = new Date(now);
    concert1Date.setDate(now.getDate() + 7); // 7 days from now

    const concert2Date = new Date(now);
    concert2Date.setDate(now.getDate() + 21); // 21 days from now

    const concertsToInsert = [
      {
        series_id: series.id,
        venue_id: venue.id,
        scheduled_date: concert1Date.toISOString().split('T')[0],
        start_time: '18:00:00',
        end_time: '18:30:00',
        status: 'scheduled',
        notes: 'First empathy series concert',
      },
      {
        series_id: series.id,
        venue_id: venue.id,
        scheduled_date: concert2Date.toISOString().split('T')[0],
        start_time: '19:00:00',
        end_time: '19:30:00',
        status: 'scheduled',
        notes: 'Second empathy series concert',
      },
    ];

    const { data: concerts, error: concertsError } = await supabase
      .from('concerts')
      .insert(concertsToInsert)
      .select();

    if (concertsError) throw concertsError;
    console.log(`✓ Created ${concerts.length} concerts`);
    concerts.forEach((concert) => {
      console.log(`  - ${concert.scheduled_date} at ${concert.start_time}`);
    });

    console.log('\n✅ Seed data created successfully!\n');
    console.log('📊 Summary:');
    console.log(`  - Series: 1 (${SERIES_NAME})`);
    console.log(`  - Venue: 1 (${VENUE_DATA.name})`);
    console.log(`  - Collections: ${collections.length}`);
    console.log(`  - Pieces: ${pieces.length}`);
    console.log(`  - Piece Stages: ${stages.length}`);
    console.log(`  - Concerts: ${concerts.length}`);
    console.log('\n🎉 Performers can now book concerts at /performer\n');
  } catch (error) {
    console.error('\n❌ Seed script failed:', error);
    process.exit(1);
  }
}

main();
