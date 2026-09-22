-- Database schema for Code à Cuisine.
-- Run this once in the Supabase SQL editor.

-- Recipes created by the automation workflow.
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  cuisine text not null check (cuisine in ('german', 'italian', 'japanese', 'indian', 'gourmet', 'fusion')),
  diet text not null check (diet in ('vegetarian', 'vegan', 'keto', 'none')),
  cooking_time text not null check (cooking_time in ('quick', 'medium', 'complex')),
  cooking_minutes integer not null check (cooking_minutes > 0),
  portions integer not null check (portions between 1 and 12),
  helpers integer not null check (helpers between 1 and 3),
  your_ingredients jsonb not null,
  -- A recipe may ask for three basic ingredients at most.
  extra_ingredients jsonb not null default '[]'::jsonb check (jsonb_array_length(extra_ingredients) <= 3),
  steps jsonb not null,
  nutrition_per_portion jsonb not null,
  nutrition_total jsonb not null,
  likes integer not null default 0 check (likes >= 0)
);

-- The library lists newest first and filters by cuisine.
create index if not exists recipes_cuisine_created_idx on public.recipes (cuisine, created_at desc);
create index if not exists recipes_likes_idx on public.recipes (likes desc);

-- One row per visitor and day, used for the daily limit.
create table if not exists public.quota_usage (
  ip inet not null,
  day date not null default current_date,
  count integer not null default 0 check (count >= 0),
  primary key (ip, day)
);

alter table public.recipes enable row level security;
alter table public.quota_usage enable row level security;

-- Everybody may read recipes, nobody may write them from the browser.
drop policy if exists "Recipes are public" on public.recipes;
create policy "Recipes are public"
  on public.recipes
  for select
  to anon, authenticated
  using (true);

grant usage on schema public to anon, authenticated;
grant select on public.recipes to anon, authenticated;

-- The quota table holds IP addresses and stays invisible to the browser.
revoke all on public.quota_usage from anon, authenticated;
