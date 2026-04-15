-- Run once in Supabase: Dashboard → SQL Editor → New query → Run
-- Re-run safe: policies are dropped first if they exist.

-- If you created an older version of the table, ensure the new columns exist.
alter table if exists public.inquiries
  add column if not exists product_id text,
  add column if not exists product_label text,
  add column if not exists message text;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(), -- inquiry receipt time (SLA / no-reply timers)
  name text not null,
  phone text not null,
  -- Optional product context (when the inquiry originates from a product page).
  product_id text,
  product_label text,
  message text,
  travel_date date not null,
  guests int not null check (guests >= 1 and guests <= 30),
  locale text
);

comment on table public.inquiries is 'Boss Travel consultation requests from the app';

alter table public.inquiries enable row level security;

drop policy if exists "inquiries_insert_anon" on public.inquiries;
drop policy if exists "inquiries_insert_authenticated" on public.inquiries;
drop policy if exists "inquiries_no_select_anon" on public.inquiries;

create policy "inquiries_insert_anon"
  on public.inquiries
  for insert
  to anon
  with check (true);

create policy "inquiries_insert_authenticated"
  on public.inquiries
  for insert
  to authenticated
  with check (true);

create policy "inquiries_no_select_anon"
  on public.inquiries
  for select
  to anon
  using (false);

-- Returns new row id to the app without granting anon SELECT on the table (anon RLS stays closed).
create or replace function public.submit_inquiry(
  p_name text,
  p_phone text,
  p_product_id text,
  p_product_label text,
  p_message text,
  p_travel_date date,
  p_guests int,
  p_locale text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into public.inquiries (name, phone, product_id, product_label, message, travel_date, guests, locale)
  values (p_name, p_phone, p_product_id, p_product_label, p_message, p_travel_date, p_guests, p_locale)
  returning id into new_id;
  return new_id;
end;
$$;

grant execute on function public.submit_inquiry(text, text, text, text, text, date, int, text) to anon, authenticated;

-- Backwards-compatible signature (older app versions) — keep until all clients upgrade.
create or replace function public.submit_inquiry(
  p_name text,
  p_phone text,
  p_travel_date date,
  p_guests int,
  p_locale text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into public.inquiries (name, phone, travel_date, guests, locale)
  values (p_name, p_phone, p_travel_date, p_guests, p_locale)
  returning id into new_id;
  return new_id;
end;
$$;

grant execute on function public.submit_inquiry(text, text, date, int, text) to anon, authenticated;
