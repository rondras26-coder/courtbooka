-- Courtbooka booking schema v0 (RONA-1048)
-- Apply via Supabase CLI (`supabase db push`) or SQL editor in order.

create table public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text not null default 'Europe/Berlin',
  created_at timestamptz not null default now()
);

create table public.courts (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues (id) on delete cascade,
  label text not null,
  sport_code text not null default 'tennis',
  created_at timestamptz not null default now()
);

create index courts_venue_id_idx on public.courts (venue_id);

create table public.court_slots (
  id uuid primary key default gen_random_uuid(),
  court_id uuid not null references public.courts (id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'available',
  created_at timestamptz not null default now(),
  constraint court_slots_time_ok check (ends_at > starts_at)
);

create index court_slots_court_time_idx on public.court_slots (court_id, starts_at);

-- Booking ties an authenticated Supabase user to a single slot (v0 constraint).
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references public.court_slots (id) on delete restrict,
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'confirmed',
  notes text,
  created_at timestamptz not null default now(),
  constraint bookings_slot_unique unique (slot_id)
);

create index bookings_user_id_idx on public.bookings (user_id);

-- RLS: deny-by-default for anon/authenticated via PostgREST (no policies yet).
alter table public.venues enable row level security;

alter table public.courts enable row level security;

alter table public.court_slots enable row level security;

alter table public.bookings enable row level security;

comment on table public.venues is 'Facility / club location hosting courts.';

comment on table public.courts is 'Playable court surface within a venue.';

comment on table public.court_slots is 'Bookable time window on a court.';

comment on table public.bookings is 'Confirmed reservation; user_id references auth.users until a profiles table exists.';

comment on column public.bookings.user_id is 'FK stub to Supabase Auth user (auth.users.id).';
