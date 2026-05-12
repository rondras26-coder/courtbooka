-- Dev seed: venue → court → slot (booking requires a real auth.users row).
-- Run after migrations. Prefer Supabase SQL editor or `supabase db execute` against your dev project.

insert into public.venues (name, slug)
values ('Courtbooka Demo Hub', 'demo-hub')
on conflict (slug) do nothing;

insert into public.courts (venue_id, label, sport_code)
select v.id,
  'Court 1',
  'tennis'
from public.venues v
where v.slug = 'demo-hub'
  and not exists (
    select 1
    from public.courts c
    where c.venue_id = v.id
      and c.label = 'Court 1'
  );

-- Deterministic “tomorrow 10:00–11:30” in venue timezone for idempotent re-runs.
insert into public.court_slots (court_id, starts_at, ends_at, status)
select c.id,
  t.starts_at,
  t.ends_at,
  'available'
from public.courts c
  join public.venues v on v.id = c.venue_id
  cross join lateral (
    select
      (
        (now() at time zone v.timezone)::date
        + interval '1 day'
        + interval '10 hours'
      ) at time zone v.timezone as starts_at,
      (
        (now() at time zone v.timezone)::date
        + interval '1 day'
        + interval '11 hours 30 minutes'
      ) at time zone v.timezone as ends_at
  ) t
where v.slug = 'demo-hub'
  and c.label = 'Court 1'
  and not exists (
    select 1
    from public.court_slots s
    where s.court_id = c.id
      and s.starts_at = t.starts_at
  );

-- Example booking (requires an existing auth user UUID):
-- insert into public.bookings (slot_id, user_id, status)
-- select s.id, '<YOUR_AUTH_USER_UUID>', 'confirmed'
-- from public.court_slots s
--   join public.courts c on c.id = s.court_id
--   join public.venues v on v.id = c.venue_id
-- where v.slug = 'demo-hub'
--   and s.status = 'available'
-- limit 1;
