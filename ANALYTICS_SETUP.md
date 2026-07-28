# Analytics Setup Guide

This project uses privacy-respecting analytics with Supabase to track deck views.

## Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **Anon Key** (found in Settings > API)

### 2. Create Database Table

In Supabase SQL Editor, run:

```sql
CREATE TABLE deck_views (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  deck_id TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for efficient querying
CREATE INDEX idx_deck_views_deck_id ON deck_views(deck_id);
CREATE INDEX idx_deck_views_timestamp ON deck_views(timestamp);

-- Enable RLS if desired (optional for privacy)
ALTER TABLE deck_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON deck_views
  FOR INSERT WITH CHECK (true);
```

### 3. Configure Environment Variables

Set these in Netlify:

```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_ANON_KEY = your-anon-key-here
```

Or in `.env.local` for local development:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Deploy

Push to main branch. Netlify will:
1. Build the site
2. Deploy the Edge Function at `/.netlify/functions/track-deck-view`
3. Start tracking deck views automatically

## How It Works

1. **Deck View Page** (`pages/decks/[id].vue`)
   - Calls `trackDeckView(deckId)` on mount
   - Sends deck ID to Edge Function

2. **Edge Function** (`netlify/edge-functions/track-deck-view.ts`)
   - Receives POST request with deck ID
   - Collects geo data (country, city)
   - Inserts into Supabase `deck_views` table
   - Non-blocking: doesn't affect page load

3. **Privacy**
   - No cookies or user tracking
   - No persistent identifiers
   - Aggregated analytics only
   - Geo data optional (can be disabled)

## Metrics

Query your analytics in Supabase:

```sql
-- Views per deck (last 30 days)
SELECT deck_id, COUNT(*) as views
FROM deck_views
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY deck_id
ORDER BY views DESC;

-- Top referrers
SELECT referrer, COUNT(*) as count
FROM deck_views
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY referrer
ORDER BY count DESC;

-- Views by country
SELECT country, COUNT(*) as views
FROM deck_views
WHERE country IS NOT NULL
GROUP BY country
ORDER BY views DESC;
```

## Success Metric

Track "time to find a deck < 15s":
- Measure average time from homepage to deck view
- Use referrer data + timestamps
- Optimize search/filtering based on top paths

