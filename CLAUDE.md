# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PopDog is a Next.js 15 application that allows users to track "pops" associated with their X (Twitter) handles. It uses Supabase as the backend database with PostgreSQL functions for atomic counter increments.

**Tech Stack:**
- Next.js 15 with App Router
- React 18 (client components)
- TypeScript
- Supabase (PostgreSQL) for data persistence
- Tailwind CSS for styling
- shadcn/ui components
- Biome for linting/formatting (instead of ESLint/Prettier)
- Jest with jsdom for testing
- Bun as package manager

## Common Commands

### Development
```bash
# Install dependencies (uses Bun)
bun install

# Start development server (with Turbopack, accessible from network)
bun run dev
# or
npm run dev

# Build for production (includes Prisma generation if configured)
bun run build

# Start production server (accessible from network)
bun run start
```

### Code Quality
```bash
# Lint and type check (uses Biome + TypeScript)
bun run lint

# Format code (uses Biome)
bun run format
```

### Testing
```bash
# Run tests with Jest
bun run test
# or
npm test
```

### Database (Prisma - if configured)
```bash
# Generate Prisma client
bun run db:generate

# Push schema changes to database
bun run db:push

# Create and run migration
bun run db:migrate
```

## Architecture

### Database Schema (Supabase/PostgreSQL)

The database uses three main tables with a stored procedure for atomic operations:

1. **profiles** - User handles/profiles
   - `id` (UUID, primary key)
   - `handle` (text, unique, 1-15 chars)
   - `created_at` (timestamptz)

2. **pop_counts** - Aggregated pop counts per handle
   - `handle` (text, primary key, foreign key to profiles)
   - `total` (bigint)
   - `updated_at` (timestamptz)
   - Indexed on `total DESC` for leaderboard queries

3. **pop_events** - Optional sparse audit log
   - `id` (bigserial)
   - `handle` (text, foreign key)
   - `popped_at` (timestamptz)
   - `ip_hash`, `ua_hash` (text)

4. **increment_pop(p_handle)** - PostgreSQL function
   - Atomically increments the pop count for a handle
   - Handles race conditions with upsert logic
   - Returns the new total

### API Routes (App Router)

All API routes use Next.js 15 Route Handlers in `src/app/api/`:

- **POST /api/register** - Register/upsert a user handle
  - Validates handle format (1-15 alphanumeric + underscore)
  - Creates profile and pop_counts records

- **POST /api/pop** - Increment pop count for a handle
  - Includes in-memory rate limiting (5s window, 10 pops max)
  - Uses `increment_pop` RPC for atomic updates
  - Throttle key: `${ip}:${handle}`

- **GET /api/leaderboard** - Fetch top poppers
  - Query param: `?limit=100` (max 500)
  - Returns sorted by `total DESC`

- **GET /api/me** - Fetch current user's pop count
  - Query param: `?handle=username`

### Frontend Architecture

- **Client-side rendering** - All interactive components use `"use client"`
- **Local storage** - Stores user handle (`pd.handle`) and background color (`pd.bg`)
- **Real-time interaction** - Direct Supabase calls from API routes, client fetches on action

**Key Components:**
- `src/app/page.tsx` (PopDog) - Main interactive dog clicking interface
- `src/app/leaderboard/page.tsx` - Leaderboard display
- `src/app/ClientBody.tsx` - Client wrapper for layout
- `src/components/ui/` - shadcn/ui components

### State Management

No global state management library. Component-level state with:
- `useState` for local UI state
- `localStorage` for persistence
- `useEffect` for initialization and side effects

## Environment Variables

Required environment variables (see `.env.template`):
```
NEXT_PUBLIC_SUPABASE_URL=       # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=      # Service role key for server-side operations
```

## Important Patterns

### Rate Limiting
The `/api/pop` endpoint implements in-memory rate limiting per `${ip}:${handle}`. For production with multiple instances, migrate to Redis or Supabase Edge Functions.

### Handle Validation
All handle inputs are validated with: `/^[A-Za-z0-9_]{1,15}$/`
Leading `@` symbols are stripped before validation.

### Atomic Increments
Pop counts use PostgreSQL's `increment_pop` function to prevent race conditions. Never increment counts in application code.

### TypeScript Configuration
- Build errors are ignored (`ignoreBuildErrors: true`)
- ESLint is skipped during builds
- Module alias: `@/` maps to `src/`

## Development Notes

- The project uses **Bun** as the package manager (see `bun.lock`)
- **Biome** is used instead of ESLint/Prettier for linting and formatting
- Dev server binds to `0.0.0.0` for network access
- Turbopack is enabled by default in dev mode
- Images are unoptimized (`unoptimized: true`)
- The schema must be run in Supabase before the app functions correctly
