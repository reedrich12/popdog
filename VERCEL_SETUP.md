# Vercel Deployment Setup Guide

This guide will help you configure environment variables in Vercel to ensure your PopDog application works correctly in production.

## Problem

If you see errors like "Server configuration error" or "supabaseUrl is required" in production, it means your environment variables are not configured in Vercel.

## Solution: Configure Environment Variables in Vercel

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard at https://app.supabase.com
2. Select your project
3. Navigate to **Settings** → **API**
4. You'll need two values:
   - **Project URL** (example: `https://qdppjynfqonjaaomozns.supabase.co`)
   - **Service Role Key** (click "Reveal" to see it - this is a secret!)

### Step 2: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard at https://vercel.com/dashboard
2. Select your PopDog project
3. Navigate to **Settings** → **Environment Variables**
4. Add the following two variables:

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Your Supabase Project URL (e.g., `https://qdppjynfqonjaaomozns.supabase.co`)
- **Environments**: Select all three:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

#### Variable 2: SUPABASE_SERVICE_ROLE_KEY
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Your Supabase Service Role Key (the secret key you revealed)
- **Environments**: Select all three:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

⚠️ **IMPORTANT**: Never share your Service Role Key publicly or commit it to Git!

### Step 3: Redeploy Your Application

After adding the environment variables, you need to trigger a new deployment:

1. Go to the **Deployments** tab in your Vercel project
2. Click the **...** menu on the latest deployment
3. Select **Redeploy**
4. Or simply push a new commit to your Git repository

### Step 4: Verify It's Working

1. Visit your production site
2. Try to register a handle and submit pops
3. Check the leaderboard
4. If you still see errors, check the **Logs** tab in Vercel to see what's wrong

## Troubleshooting

### Error: "Server configuration error"
- **Cause**: Environment variables are not set or are set incorrectly
- **Fix**: Double-check that both variables are set in all three environments (Production, Preview, Development)

### Error: "supabaseUrl is required"
- **Cause**: `NEXT_PUBLIC_SUPABASE_URL` is missing or empty
- **Fix**: Add the variable with your Supabase Project URL

### Changes not taking effect
- **Cause**: Vercel caches deployments
- **Fix**: Trigger a new deployment after changing environment variables

## Local Development

For local development, you don't need to configure Vercel. Instead:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`

3. Never commit `.env.local` to Git (it's already in `.gitignore`)

## Security Best Practices

- ✅ Store Service Role Key only in Vercel environment variables and local `.env.local`
- ✅ Never commit actual credentials to Git
- ✅ Use `.env.example` only for documentation (with placeholder values)
- ❌ Never expose Service Role Key in client-side code
- ❌ Never share Service Role Key in screenshots or support tickets
