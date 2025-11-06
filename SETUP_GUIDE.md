# MusicUp Setup Guide

## Getting Your Data Into Supabase

To see concerts and music library data in your application, you need to run these scripts to populate your Supabase database.

### Step 1: Update Empathy Concerts Data

This populates your database with:
- 2 collections (The Golden Collection & The Next Steps Set)
- 24 songs with complete metadata (composer, year, etc.)
- 2 venues (Ivy Park at Pleasanton & Oakmont of Silver Creek)

```bash
pnpm run update-empathy
```

**Expected Output:**
```
🎵 Starting Empathy Concerts data update...

📚 Finding Empathy Concerts series...
✓ Found series: empathy (...)

📦 Updating collections...
✓ Updated 2 collections

🎵 Updating pieces for The Golden Collection...
✓ Updated 12 pieces in The Golden Collection

🎵 Updating pieces for The Next Steps Set...
✓ Updated 12 pieces in The Next Steps Set

🏛️  Updating venues...
✓ Updated venue: Ivy Park at Pleasanton
✓ Created venue: Oakmont of Silver Creek

✅ Empathy Concerts data updated successfully!
```

### Step 2: Schedule Concerts

This creates 6 scheduled concerts:

**Ivy Park at Pleasanton:**
- November 8, 2025 at 4:00 PM - 4:30 PM
- December 13, 2025 at 4:00 PM - 4:30 PM

**Oakmont of Silver Creek:**
- November 8, 2025 at 10:30 AM - 11:00 AM (back upright piano)
- November 8, 2025 at 11:00 AM - 11:30 AM (main front grand piano)
- December 13, 2025 at 10:30 AM - 11:00 AM (back upright piano)
- December 13, 2025 at 11:00 AM - 11:30 AM (main front grand piano)

```bash
pnpm run schedule-concerts
```

**Expected Output:**
```
🎭 Starting concert scheduling script...

📚 Finding Empathy Concerts series...
✓ Found series: empathy (...)

🏛️  Finding venues...
✓ Found 2 venues

🗑️  Removing old scheduled concerts...
✓ Removed old scheduled concerts

🎭 Scheduling new concerts...
✓ Scheduled 6 concerts:

📍 Ivy Park at Pleasanton:
   - 2025-11-08 at 16:00:00 - 16:30:00
   - 2025-12-13 at 16:00:00 - 16:30:00

📍 Oakmont of Silver Creek:
   - 2025-11-08 at 10:30:00 - 11:00:00 (upright piano)
   - 2025-11-08 at 11:00:00 - 11:30:00 (grand piano)
   - 2025-12-13 at 10:30:00 - 11:00:00 (upright piano)
   - 2025-12-13 at 11:00:00 - 11:30:00 (grand piano)

✅ Concert scheduling complete!
```

### Step 3: Verify in Your App

After running both scripts:

1. **Go to `/performer` (Performer Dashboard)**
   - You should see concerts available for booking under "Book Concert" tab
   - Step 1: Choose Location - You'll see both venues
   - Step 2: Select Concert - You'll see the scheduled concerts

2. **Go to `/library` or click "Repertoire" tab**
   - You should see "The Golden Collection" and "The Next Steps Set"
   - Each collection has 12 songs with composer and year information

### Troubleshooting

**If you see "No concerts available":**
- Make sure you ran BOTH scripts in order
- Check that your `.env.local` has the correct Supabase credentials:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_url
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ```

**If scripts fail with "Empathy series not found":**
- You may need to run the initial seed script first:
  ```bash
  pnpm run seed
  ```

**To start fresh:**
- Go to your Supabase dashboard
- Delete all rows from tables: concerts, venues, pieces, collections, series
- Run scripts in order: seed → update-empathy → schedule-concerts

### What Each Script Does

| Script | Purpose | Creates/Updates |
|--------|---------|-----------------|
| `seed` | Initial database setup | Basic empathy series, 1 venue, placeholder data |
| `update-empathy` | Add real music & venue data | 24 real songs, 2 venues with addresses |
| `schedule-concerts` | Create bookable concerts | 6 concerts with specific dates/times |

### Database Schema

```
series (empathy)
  └─ collections (The Golden Collection, The Next Steps Set)
      └─ pieces (24 songs with metadata)
          └─ piece_stages (Stage 1, 2, 3 for each piece)

venues (Ivy Park, Oakmont)
  └─ concerts (6 scheduled performances)
```

## Need Help?

If concerts still don't appear after running the scripts, check:
1. Supabase connection in browser console
2. Row Level Security (RLS) policies on tables
3. That your user account has the "performer" role in the profiles table
