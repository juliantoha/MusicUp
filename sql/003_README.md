# Migration 003: Add Booking Edit Functionality

## Overview
This migration adds the `updated_at` field to the `bookings` table to track when bookings are modified.

## Changes
- Adds `updated_at` TIMESTAMPTZ column to `bookings` table
- Creates a trigger to automatically update `updated_at` on row updates
- Enables tracking of booking modifications for edit history

## How to Apply

### Option 1: Using Supabase CLI
```bash
# Copy migration to Supabase migrations directory
cp sql/003_add_booking_updated_at.sql supabase/migrations/$(date +%Y%m%d%H%M%S)_add_booking_updated_at.sql

# Apply migration
supabase db reset
```

### Option 2: Direct SQL Execution
```bash
# Execute via Supabase CLI
supabase db execute --file sql/003_add_booking_updated_at.sql --local

# Or via psql
psql <your-database-url> -f sql/003_add_booking_updated_at.sql
```

### Option 3: Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `sql/003_add_booking_updated_at.sql`
4. Run the query

## Related Changes
This migration is part of the booking edit flow implementation (Prompt 11):
- Backend: `/src/lib/bookings/actions.ts` - Added `updateBooking()` function
- Frontend: `/src/components/performer/ChangeBookingTab.tsx` - Added edit UI
- Types: `/src/types/db.ts` - Updated Booking type to include `updated_at`

## Testing
After applying the migration:
1. Log in as a performer
2. Go to "Change Booking" tab
3. Click "Edit Booking" on an upcoming concert
4. Select a different piece/stage
5. Verify the booking updates successfully
6. Check that admin view shows the updated piece/stage
