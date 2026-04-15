-- Run in Supabase: Dashboard → SQL Editor → New query → Run
-- Re-run safe: uses IF NOT EXISTS / CREATE OR REPLACE patterns.

-- Optional product metadata (youtube, gallery, itinerary, inclusions) for Seojin Travel.
-- Catalog ids/prices still live in `data/products.json`; this table extends per-id server data.

create table if not exists public.products (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Optional: a canonical display name stored server-side (not required by the app).
  product_name text,

  -- Optional: default KO marketing copy; UI falls back to next-intl when unset or non-ko locale without DB copy.
  title text,
  subtitle text,
  description text,

  price_krw bigint,
  duration_days integer,

  -- Optional: YouTube URL or video id for the product.
  youtube_url text,

  -- Optional: gallery image URLs for richer sharing cards.
  gallery_images text[] not null default '{}'::text[],

  -- Optional: structured itinerary (e.g. JSON array of day lines, or locale-keyed object).
  itinerary jsonb,

  -- Optional: bullet lists for quote / detail pages.
  inclusions text[] not null default '{}'::text[],
  exclusions text[] not null default '{}'::text[]
);

comment on table public.products is 'Optional product metadata for Seojin Travel app';

-- Existing projects: add columns without breaking current rows.
alter table public.products add column if not exists title text;
alter table public.products add column if not exists subtitle text;
alter table public.products add column if not exists description text;
alter table public.products add column if not exists price_krw bigint;
alter table public.products add column if not exists duration_days integer;

alter table public.products add column if not exists youtube_url text;
alter table public.products add column if not exists itinerary jsonb;
alter table public.products add column if not exists inclusions text[] not null default '{}'::text[];
alter table public.products add column if not exists exclusions text[] not null default '{}'::text[];

-- UPSERT: `id` is the primary key, so `INSERT ... ON CONFLICT (id) DO UPDATE` is supported
-- and overwrites row data by id (use your conflict target columns list in DO UPDATE SET).

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

alter table public.products enable row level security;

-- Public read-only (needed for youtube_url on product detail pages).
drop policy if exists "products_select_anon" on public.products;
drop policy if exists "products_select_authenticated" on public.products;

create policy "products_select_anon"
  on public.products
  for select
  to anon
  using (true);

create policy "products_select_authenticated"
  on public.products
  for select
  to authenticated
  using (true);

-- (Optional) If you manage products from an admin dashboard, add stricter write policies later.

-- After creating the table, sync catalog rows from the repo:
--   supabase/sql/products_seed_upsert.sql
