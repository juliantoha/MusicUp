# MusicUp Database Migrations

This directory contains SQL migrations for the MusicUp Supabase database.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) installed
- Supabase account and project (or local Supabase setup)

## Installation

If you haven't installed the Supabase CLI yet:

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows (using Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or use npm
npm install -g supabase
```

## Local Development Setup

### 1. Initialize Supabase

If this is your first time, initialize Supabase in your project:

```bash
# Run from the project root directory
supabase init
```

### 2. Start Supabase Locally

Start the local Supabase services (PostgreSQL, Auth, Storage, etc.):

```bash
supabase start
```

This will start all services and output the local connection details:
- API URL: `http://localhost:54321`
- DB URL: `postgresql://postgres:postgres@localhost:54322/postgres`
- Studio URL: `http://localhost:54323`
- Anon key: (displayed in output)
- Service Role key: (displayed in output)

**Important:** Copy the `anon key` and `service_role_key` to your `.env.local` file.

### 3. Apply Migrations

There are two ways to apply migrations:

#### Option A: Using Supabase CLI (Recommended)

Copy the migration files to the Supabase migrations directory:

```bash
# Create migrations directory if it doesn't exist
mkdir -p supabase/migrations

# Copy migrations
cp sql/001_init.sql supabase/migrations/20240101000001_init.sql
cp sql/002_seed.sql supabase/migrations/20240101000002_seed.sql

# Apply migrations
supabase db reset
```

#### Option B: Manual SQL Execution

Execute the SQL files directly:

```bash
# Connect to your local database and run migrations
psql postgresql://postgres:postgres@localhost:54322/postgres -f sql/001_init.sql
psql postgresql://postgres:postgres@localhost:54322/postgres -f sql/002_seed.sql
```

Or use the Supabase CLI:

```bash
supabase db execute --file sql/001_init.sql --local
supabase db execute --file sql/002_seed.sql --local
```

### 4. Verify Migrations

Check that tables were created successfully:

```bash
# List all tables
supabase db diff --local

# Or connect to the database directly
psql postgresql://postgres:postgres@localhost:54322/postgres -c "\dt"
```

You can also use Supabase Studio at `http://localhost:54323` to browse your database.

## Remote/Production Setup

### 1. Link to Your Supabase Project

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref
```

### 2. Push Migrations to Remote

```bash
# Push migrations to remote database
supabase db push
```

### 3. Update Environment Variables

Update your production `.env` file with the remote Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Schema Overview

### Core Tables

- **profiles**: User profiles linked to Supabase Auth
- **venues**: Concert venues
- **admins_venues**: Admin-venue assignments for scoped access
- **series**: Concert series (e.g., "Empathy Concerts")
- **collections**: Music collections within a series
- **pieces**: Individual musical pieces
- **piece_stages**: Different difficulty stages for each piece
- **concerts**: Scheduled performances
- **bookings**: Performer bookings for concerts
- **attendance_checks**: Attendance tracking
- **concert_photos**: Concert photo uploads
- **service_hours**: Service hour tracking

### Storage Buckets

- **scores**: PDF music scores (public read, admin write)
- **audio**: Audio files (public read, admin write)
- **concert_photos**: Concert photos (public read, admin write)

## Row Level Security (RLS)

All tables have RLS enabled with the following access patterns:

- **Performers**: Can read library content, manage own bookings, view own data
- **Admins**: Can manage content for their assigned venues
- **Super Admins**: Full access to all data

### Testing RLS Policies

You can test RLS policies using the Supabase SQL Editor or by connecting with different user roles:

```sql
-- Test as anonymous user (should only see scheduled concerts)
SET ROLE anon;
SELECT * FROM concerts;

-- Test as authenticated user
SET ROLE authenticated;
SELECT * FROM bookings WHERE profile_id = auth.uid();
```

## Seed Data

The seed migration (`002_seed.sql`) creates:

- 1 series: "Empathy Concerts"
- 1 venue: "Ivy Park Pleasanton"
- 4 collections: 1 primary + 3 secondary
- 48 pieces: 12 per collection
- 144 piece stages: 3 per piece
- 2 upcoming concerts

## Useful Commands

```bash
# Reset database (drops all data and reapplies migrations)
supabase db reset --local

# Create a new migration
supabase migration new your_migration_name

# Check migration status
supabase migration list

# Generate TypeScript types from your database
supabase gen types typescript --local > src/types/database.types.ts

# Stop local Supabase
supabase stop

# View logs
supabase logs
```

## Troubleshooting

### Migration Fails

If a migration fails:

1. Check the error message in the output
2. Fix the SQL file
3. Run `supabase db reset` to start fresh

### RLS Policy Issues

If you can't access data as expected:

1. Check that RLS is enabled on the table
2. Verify your auth token has the correct role
3. Test policies in Supabase Studio SQL Editor

### Connection Issues

If you can't connect to the local database:

1. Ensure Docker is running
2. Run `supabase status` to check service health
3. Try `supabase stop` then `supabase start`

## Next Steps

After setting up the database:

1. Update your `.env.local` with the Supabase credentials
2. Test the API endpoints in your Next.js app
3. Verify RLS policies work as expected
4. Create test users with different roles to test permissions

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
