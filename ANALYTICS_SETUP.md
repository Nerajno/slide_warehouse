# Analytics Setup Guide

This project uses privacy-respecting analytics with Supabase to track deck views.

## Setup Steps

### 1. Supabase Project

- Project already exists: `Slide_warehouse` (ref `zcxfztxhjxxegvuhsdjf`, region eu-west-1), URL `https://zcxfztxhjxxegvuhsdjf.supabase.co`.
- Note: free-tier projects auto-pause after ~1 week of inactivity. While paused the edge function returns 503. Restore from the Supabase dashboard (or the Supabase MCP `restore_project` tool).

### 2. Database Schema

The schema lives in `supabase/migrations/` and is the source of truth — do not paste ad-hoc SQL.

- `20261028233500_create_deck_views.sql` — `deck_views` table, indexes, RLS, insert policy.
- `20261028235000_revoke_rls_auto_enable_execute.sql` — stops API roles calling the `rls_auto_enable()` event-trigger function (clears the Supabase security advisor warning).

Apply new migrations in order with the Supabase MCP `apply_migration` tool or by pasting them into the SQL Editor.

Access rules:

- `anon` role can INSERT only, and only when `deck_id` is non-empty.
- No SELECT policy, so the anon key cannot read views back.
- Query data via the dashboard / SQL Editor (service role).
- RLS is enabled; the project's `ensure_rls` event trigger also auto-enables RLS on new tables.

After any schema change, run the Supabase security advisor (dashboard → Advisors, or MCP `get_advisors`).

### 3. Configure Environment Variables

Use the **legacy anon key** (JWT, starts with `eyJ`) from Settings > API, not the newer `sb_publishable_...` key. The edge function sends it as `Authorization: Bearer`, which requires a JWT.

Set these in Netlify:

```
SUPABASE_URL = https://zcxfztxhjxxegvuhsdjf.supabase.co
SUPABASE_ANON_KEY = your-anon-key-here
```

Or in `.env.local` for local development:

```bash
SUPABASE_URL=https://zcxfztxhjxxegvuhsdjf.supabase.co
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

