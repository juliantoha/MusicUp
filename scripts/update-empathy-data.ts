#!/usr/bin/env tsx

/**
 * MusicUp Empathy Concerts Data Update Script
 *
 * This script updates the existing Empathy Concerts series with complete real data:
 * - Updates collections with proper descriptions
 * - Updates all 24 pieces with correct composer and year information
 * - Updates venues with correct addresses and performance schedules
 * - Adds Oakmont of Silver Creek venue
 *
 * Usage: pnpm run update-empathy
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

// The Golden Collection - Complete data
const GOLDEN_COLLECTION = [
  { title: "Can't Help Falling in Love", composer: "Elvis Presley", year: 1961, order: 1 },
  { title: "Somewhere Over the Rainbow", composer: "Judy Garland", year: 1939, order: 2 },
  { title: "What a Wonderful World", composer: "Louis Armstrong", year: 1967, order: 3 },
  { title: "Let Me Call You Sweetheart", composer: "Peerless Quartet", year: 1910, order: 4 },
  { title: "Que Sera, Sera (Whatever Will Be, Will Be)", composer: "Doris Day", year: 1956, order: 5 },
  { title: "Moon River", composer: "Audrey Hepburn / Andy Williams", year: 1961, order: 6 },
  { title: "When You Wish Upon a Star", composer: "Cliff Edwards (Jiminy Cricket)", year: 1940, order: 7 },
  { title: "Edelweiss", composer: "Christopher Plummer / Theodore Bikel", year: 1959, order: 8 },
  { title: "Take Me Out to the Ball Game", composer: "Edward Meeker", year: 1908, order: 9 },
  { title: "You Are My Sunshine", composer: "Jimmie Davis", year: 1939, order: 10 },
  { title: "Singin' in the Rain", composer: "Gene Kelly", year: 1952, order: 11 },
  { title: "Unchained Melody", composer: "The Righteous Brothers", year: 1955, order: 12 },
];

// The Next Steps Set - Complete data
const NEXT_STEPS_SET = [
  { title: "It's a Long Way to Tipperary", composer: "Traditional", year: 1912, order: 1 },
  { title: "As Time Goes By", composer: "Dooley Wilson", year: 1931, order: 2 },
  { title: "My Bonnie Lies Over the Ocean", composer: "Traditional", year: 1950, order: 3 },
  { title: "Rock Around the Clock", composer: "Bill Haley & His Comets", year: 1954, order: 4 },
  { title: "On the Sunny Side of the Street", composer: "Louis Armstrong / Tommy Dorsey", year: 1930, order: 5 },
  { title: "Stand By Me", composer: "Ben E. King", year: 1961, order: 6 },
  { title: "Can't Take My Eyes Off You", composer: "Frankie Valli", year: 1967, order: 7 },
  { title: "You'll Never Walk Alone", composer: "Rodgers and Hammerstein", year: 1945, order: 8 },
  { title: "Fly Me to the Moon", composer: "Frank Sinatra", year: 1964, order: 9 },
  { title: "Under the Boardwalk", composer: "The Drifters", year: 1964, order: 10 },
  { title: "Hey Jude", composer: "The Beatles", year: 1968, order: 11 },
  { title: "This Land Is Your Land", composer: "Woody Guthrie", year: 1940, order: 12 },
];

// Venue data
const VENUES = [
  {
    name: 'Ivy Park at Pleasanton',
    address: '5700 Pleasant Hill Rd',
    city: 'Pleasanton',
    state: 'CA',
    zip: '94588',
    contact_email: 'events@ivypark.org',
    notes: 'Performs every second Saturday at 4:00 PM - 4:30 PM',
  },
  {
    name: 'Oakmont of Silver Creek',
    address: '3544 San Felipe Rd',
    city: 'San Jose',
    state: 'CA',
    zip: '95135',
    contact_email: 'events@oakmontsilver creek.org',
    notes: 'Performs every second Saturday at 10:30 AM - 11:00 AM (back upright piano) and 11:00 AM - 11:30 AM (main front grand piano)',
  },
];

async function main() {
  console.log('🎵 Starting Empathy Concerts data update...\n');

  try {
    // 1. Get Empathy series
    console.log('📚 Finding Empathy Concerts series...');
    const { data: series, error: seriesError } = await supabase
      .from('series')
      .select('*')
      .eq('name', 'empathy')
      .single();

    if (seriesError || !series) {
      console.error('❌ Empathy series not found. Please run the seed script first.');
      process.exit(1);
    }
    console.log(`✓ Found series: ${series.name} (${series.id})\n`);

    // 2. Update or create collections
    console.log('📦 Updating collections...');

    // Check for existing collections
    const { data: existingCollections } = await supabase
      .from('collections')
      .select('*')
      .eq('series_id', series.id)
      .order('display_order');

    let goldenCollection, nextStepsCollection;

    if (existingCollections && existingCollections.length >= 2) {
      // Update existing collections
      goldenCollection = existingCollections[0];
      nextStepsCollection = existingCollections[1];

      await supabase
        .from('collections')
        .update({
          name: 'The Golden Collection',
          description: 'The first 12 songs every student should learn for leading unforgettable singalongs with seniors. These are crowd-pleasers. Instantly familiar, easy to sing, and guaranteed to spark smiles, stories, and even tears of joy.',
        })
        .eq('id', goldenCollection.id);

      await supabase
        .from('collections')
        .update({
          name: 'The Next Steps Set',
          description: 'After mastering the Starter Set, students step into this powerful second set of 12. These songs bring new rhythms, stories, and memories—sparking laughter, nostalgia, and community in every session.',
        })
        .eq('id', nextStepsCollection.id);

      console.log('✓ Updated 2 collections\n');
    } else {
      // Create collections if they don't exist
      const { data: newCollections, error: collectionsError } = await supabase
        .from('collections')
        .insert([
          {
            series_id: series.id,
            name: 'The Golden Collection',
            description: 'The first 12 songs every student should learn for leading unforgettable singalongs with seniors. These are crowd-pleasers. Instantly familiar, easy to sing, and guaranteed to spark smiles, stories, and even tears of joy.',
            display_order: 1,
          },
          {
            series_id: series.id,
            name: 'The Next Steps Set',
            description: 'After mastering the Starter Set, students step into this powerful second set of 12. These songs bring new rhythms, stories, and memories—sparking laughter, nostalgia, and community in every session.',
            display_order: 2,
          },
        ])
        .select();

      if (collectionsError) throw collectionsError;
      goldenCollection = newCollections[0];
      nextStepsCollection = newCollections[1];
      console.log('✓ Created 2 collections\n');
    }

    // 3. Update or create pieces for Golden Collection
    console.log('🎵 Updating pieces for The Golden Collection...');
    const { data: existingGolden } = await supabase
      .from('pieces')
      .select('*')
      .eq('collection_id', goldenCollection.id)
      .order('display_order');

    if (existingGolden && existingGolden.length === 12) {
      // Update existing pieces
      for (let i = 0; i < GOLDEN_COLLECTION.length; i++) {
        await supabase
          .from('pieces')
          .update({
            title: GOLDEN_COLLECTION[i].title,
            composer: GOLDEN_COLLECTION[i].composer,
            year_composed: GOLDEN_COLLECTION[i].year,
            display_order: GOLDEN_COLLECTION[i].order,
          })
          .eq('id', existingGolden[i].id);
      }
      console.log('✓ Updated 12 pieces in The Golden Collection\n');
    } else {
      // Delete old pieces and create new ones
      if (existingGolden && existingGolden.length > 0) {
        await supabase
          .from('pieces')
          .delete()
          .eq('collection_id', goldenCollection.id);
      }

      const piecesToInsert = GOLDEN_COLLECTION.map((piece) => ({
        collection_id: goldenCollection.id,
        title: piece.title,
        composer: piece.composer,
        year_composed: piece.year,
        display_order: piece.order,
      }));

      const { error: piecesError } = await supabase
        .from('pieces')
        .insert(piecesToInsert);

      if (piecesError) throw piecesError;
      console.log('✓ Created 12 pieces in The Golden Collection\n');
    }

    // 4. Update or create pieces for Next Steps Set
    console.log('🎵 Updating pieces for The Next Steps Set...');
    const { data: existingNextSteps } = await supabase
      .from('pieces')
      .select('*')
      .eq('collection_id', nextStepsCollection.id)
      .order('display_order');

    if (existingNextSteps && existingNextSteps.length === 12) {
      // Update existing pieces
      for (let i = 0; i < NEXT_STEPS_SET.length; i++) {
        await supabase
          .from('pieces')
          .update({
            title: NEXT_STEPS_SET[i].title,
            composer: NEXT_STEPS_SET[i].composer,
            year_composed: NEXT_STEPS_SET[i].year,
            display_order: NEXT_STEPS_SET[i].order,
          })
          .eq('id', existingNextSteps[i].id);
      }
      console.log('✓ Updated 12 pieces in The Next Steps Set\n');
    } else {
      // Delete old pieces and create new ones
      if (existingNextSteps && existingNextSteps.length > 0) {
        await supabase
          .from('pieces')
          .delete()
          .eq('collection_id', nextStepsCollection.id);
      }

      const piecesToInsert = NEXT_STEPS_SET.map((piece) => ({
        collection_id: nextStepsCollection.id,
        title: piece.title,
        composer: piece.composer,
        year_composed: piece.year,
        display_order: piece.order,
      }));

      const { error: piecesError } = await supabase
        .from('pieces')
        .insert(piecesToInsert);

      if (piecesError) throw piecesError;
      console.log('✓ Created 12 pieces in The Next Steps Set\n');
    }

    // 5. Update/Create venues
    console.log('🏛️  Updating venues...');
    for (const venueData of VENUES) {
      // Check if venue exists by name
      const { data: existingVenue } = await supabase
        .from('venues')
        .select('*')
        .eq('name', venueData.name)
        .single();

      if (existingVenue) {
        // Update existing venue
        await supabase
          .from('venues')
          .update(venueData)
          .eq('id', existingVenue.id);
        console.log(`✓ Updated venue: ${venueData.name}`);
      } else {
        // Create new venue
        await supabase
          .from('venues')
          .insert(venueData);
        console.log(`✓ Created venue: ${venueData.name}`);
      }
    }

    console.log('\n✅ Empathy Concerts data updated successfully!\n');
    console.log('📊 Summary:');
    console.log('  - Collections: 2 (The Golden Collection, The Next Steps Set)');
    console.log('  - Pieces: 24 (all with composer and year data)');
    console.log('  - Venues: 2 (with complete address and schedule information)');
    console.log('\n🎉 Music library now has complete searchable metadata!\n');
  } catch (error) {
    console.error('\n❌ Update script failed:', error);
    process.exit(1);
  }
}

main();
