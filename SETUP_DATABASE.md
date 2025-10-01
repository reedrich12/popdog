# Database Setup Instructions

The PopDog app requires database tables to be created in your Supabase project.

## Quick Setup (2 minutes)

1. Go to your Supabase project: https://supabase.com/dashboard/project/qdppjynfqonjaaomozns

2. Click on **"SQL Editor"** in the left sidebar

3. Click **"New Query"**

4. Copy and paste the entire contents of `schema.sql` into the editor

5. Click **"Run"** or press `Ctrl+Enter`

6. You should see a success message: "Success. No rows returned"

## What This Creates

- `profiles` table - Stores user handles
- `pop_counts` table - Stores pop counts per user
- `pop_events` table - Optional audit log
- `increment_pop()` function - Atomic counter increment (optional, app has fallback)

## Verify It Worked

After running the SQL, refresh your browser and try clicking the dog. The counter should increment and persist!

## Alternative: Manual Table Creation

If you prefer, you can create tables manually in the Supabase Table Editor:

### profiles table
- id (uuid, primary key, default: gen_random_uuid())
- handle (text, unique, not null)
- created_at (timestamptz, default: now())

### pop_counts table
- handle (text, primary key, foreign key to profiles.handle)
- total (bigint, default: 0)
- updated_at (timestamptz, default: now())

Then create an index on pop_counts(total DESC) for fast leaderboard queries.
