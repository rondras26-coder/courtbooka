-- RONA-1055: explicit RLS policies + booking triggers (slot lock + status transition).
-- Validates availability with FOR UPDATE; marks court_slots booked after insert.

create or replace function public.trg_bookings_before_insert_validate()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform 1
  from public.court_slots
  where id = new.slot_id
    and status = 'available'
  for update;

  if not found then
    raise exception 'SLOT_NOT_AVAILABLE'
      using errcode = 'check_violation';
  end if;

  if auth.uid() is not null and new.user_id is distinct from auth.uid() then
    raise exception 'USER_ID_MISMATCH'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

create or replace function public.trg_bookings_after_insert_mark_slot_booked()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.court_slots
  set status = 'booked'
  where id = new.slot_id;

  return new;
end;
$$;

drop trigger if exists bookings_before_insert_validate on public.bookings;

create trigger bookings_before_insert_validate
  before insert on public.bookings
  for each row
  execute function public.trg_bookings_before_insert_validate();

drop trigger if exists bookings_after_insert_mark_slot_booked on public.bookings;

create trigger bookings_after_insert_mark_slot_booked
  after insert on public.bookings
  for each row
  execute function public.trg_bookings_after_insert_mark_slot_booked();

-- Catalog + slots: readable to discover inventory (writes stay server-side or via triggers).
drop policy if exists "venues_select_public" on public.venues;
drop policy if exists "courts_select_public" on public.courts;
drop policy if exists "court_slots_select_public" on public.court_slots;
drop policy if exists "bookings_select_own" on public.bookings;
drop policy if exists "bookings_insert_own" on public.bookings;

create policy "venues_select_public"
  on public.venues
  for select
  to anon, authenticated
  using (true);

create policy "courts_select_public"
  on public.courts
  for select
  to anon, authenticated
  using (true);

create policy "court_slots_select_public"
  on public.court_slots
  for select
  to anon, authenticated
  using (true);

-- Bookings: JWT-scoped read + insert (user must bind auth.uid() on insert).
create policy "bookings_select_own"
  on public.bookings
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "bookings_insert_own"
  on public.bookings
  for insert
  to authenticated
  with check (auth.uid() = user_id);

comment on function public.trg_bookings_before_insert_validate() is
  'Locks slot row, ensures status=available; enforces user_id=auth.uid() when JWT present.';

comment on function public.trg_bookings_after_insert_mark_slot_booked() is
  'SECURITY DEFINER: transition slot to booked (RLS would block session role UPDATE).';
