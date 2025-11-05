# MusicUp Seed Script

## Overview
This script populates the database with test data to enable immediate testing and development.

## What Gets Created

### 1. Series
- **Name**: empathy
- **Description**: Empathy music series for young performers

### 2. Venue
- **Name**: Ivy Park Pleasanton
- **Location**: 4860 Bernal Ave, Pleasanton, CA 94566
- **Contact**: info@ivypark.org

### 3. Collections (2 total)
- **Primary Collection**: 12 pieces
- **Secondary Collection**: 12 pieces

### 4. Pieces (24 total)
Each collection contains 12 pieces:
1. Arabesque
2. Ballade
3. Caprice
4. Divertimento
5. Étude
6. Fantasia
7. Gavotte
8. Humoresque
9. Impromptu
10. Jig
11. Krakowiak
12. Lullaby

### 5. Piece Stages (72 total)
Each piece has 3 difficulty stages:
- **Stage 1**: Beginner level
- **Stage 2**: Intermediate level
- **Stage 3**: Advanced level

Each stage includes:
- Score URL (placeholder)
- Audio URL (placeholder)
- Difficulty notes

### 6. Concerts (2 total)
Two upcoming concerts scheduled:
- **Concert 1**: 7 days from now, 18:00-18:30 (30 minutes)
- **Concert 2**: 21 days from now, 19:00-19:30 (30 minutes)

## Prerequisites

### 1. Environment Variables
Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` is required for the seed script to bypass Row Level Security (RLS) policies.

### 2. Install Dependencies
```bash
pnpm install
```

This will install:
- `tsx` - TypeScript execution engine
- `dotenv` - Environment variable loader
- `@supabase/supabase-js` - Supabase client (already installed)

## Usage

### Run the Seed Script
```bash
pnpm run seed
```

### Expected Output
```
🌱 Starting seed script...

📚 Creating series...
✓ Created series: empathy (abc-123-...)

🏛️  Creating venue...
✓ Created venue: Ivy Park Pleasanton (def-456-...)

📦 Creating collections...
✓ Created 2 collections

🎵 Creating pieces...
✓ Created 24 pieces

🎼 Creating piece stages...
✓ Created 72 piece stages

🎭 Creating concerts...
✓ Created 2 concerts
  - 2025-11-12 at 18:00:00
  - 2025-12-26 at 19:00:00

✅ Seed data created successfully!

📊 Summary:
  - Series: 1 (empathy)
  - Venue: 1 (Ivy Park Pleasanton)
  - Collections: 2
  - Pieces: 24
  - Piece Stages: 72
  - Concerts: 2

🎉 Performers can now book concerts at /performer
```

## After Seeding

### Test the Application

1. **Log in as a Performer**
   - Navigate to `/performer`
   - You should see the "Book a Concert" tab

2. **Book a Concert**
   - Step 1: Choose Location → Select "Ivy Park Pleasanton"
   - Step 2: Select Concert → Choose one of the two upcoming concerts
   - Step 3: Pick Your Piece → Select from empathy series pieces

3. **Verify Booking**
   - Go to "My Bookings" tab
   - Your booking should appear with concert details

## Troubleshooting

### Missing Service Role Key
```
❌ Missing environment variables
Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
```

**Solution**: Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env.local` file. You can find this in your Supabase project settings under API > Project API keys > service_role (secret).

### Permission Denied Errors
If you see RLS policy errors, make sure you're using the service role key, not the anon key.

### Duplicate Data
If you run the seed script multiple times, you may get unique constraint violations. To reset:

1. **Option 1**: Delete data via Supabase Dashboard
   - Go to Table Editor
   - Delete rows from: concerts, piece_stages, pieces, collections, series, venues

2. **Option 2**: Drop and recreate tables
   ```bash
   # If using Supabase CLI
   supabase db reset
   ```

## Data Structure

The seed script creates data in this order to respect foreign key constraints:

1. Series (independent)
2. Venue (independent)
3. Collections (depends on Series)
4. Pieces (depends on Collections)
5. Piece Stages (depends on Pieces)
6. Concerts (depends on Series and Venue)

## Customization

To customize the seed data, edit `scripts/seed.ts`:

- **Change series name**: Modify `SERIES_NAME` constant
- **Change venue**: Modify `VENUE_DATA` object
- **Change piece names**: Modify `PIECE_NAMES` array
- **Change concert dates**: Modify date calculations in concert creation section
- **Add more pieces**: Increase loop counter in piece creation section

## Script Details

- **Language**: TypeScript
- **Runtime**: tsx (TypeScript execution)
- **Database**: Supabase PostgreSQL
- **Client**: @supabase/supabase-js with service role authentication

## Notes

- The script uses the service role key to bypass RLS, allowing data insertion without authentication
- Placeholder URLs are used for scores and audio files
- Concert times are hardcoded to 18:00-18:30 and 19:00-19:30
- All data is created with default statuses (concerts are 'scheduled', etc.)
