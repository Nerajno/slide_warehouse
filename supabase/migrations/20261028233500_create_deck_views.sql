-- Deck view analytics, written by netlify/edge-functions/track-deck-view.ts
create table if not exists public.deck_views (
  id bigint primary key generated always as identity,
  deck_id text not null,
  timestamp timestamptz not null,
  user_agent text,
  referrer text,
  country text,
  city text,
  created_at timestamptz default now()
);

create index if not exists idx_deck_views_deck_id on public.deck_views (deck_id);
create index if not exists idx_deck_views_timestamp on public.deck_views (timestamp);

alter table public.deck_views enable row level security;

-- Anon key may insert views but never read them back (no select policy)
drop policy if exists "Allow anonymous inserts" on public.deck_views;
create policy "Allow anonymous inserts" on public.deck_views
  for insert to anon
  with check (deck_id <> '');
