-- =====================================================================
-- RevMate: initial database schema
-- Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run
--
-- Security model
--   * Row Level Security (RLS) is ON for every table.
--   * Access is granted table by table (the project does not auto-grant).
--   * Bikes and showrooms: anyone can read; only the server (secret key) writes.
--   * Personal data: each signed-in user can read and change only their own rows.
--   * Rides: anyone sees approved rides; organisers manage their own; admins approve.
--   * Chat sessions: server only, never readable from the browser.
-- =====================================================================

-- ---------- helpers -------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- admins --------------------------------------------------
-- Add a row here (in the SQL editor) to make a user an admin.

create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- no policies: only the server and the SQL editor can read or change admins

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- bikes ---------------------------------------------------

create table public.bikes (
  id                        uuid primary key default gen_random_uuid(),
  slug                      text not null unique,
  brand                     text not null,
  model                     text not null,
  variant                   text,
  style                     text not null check (style in
                              ('commuter','cafe_racer','cruiser','naked','sport','adventure','scrambler','retro','scooter')),
  engine_cc                 numeric(6,1) not null check (engine_cc > 0),
  power_bhp                 numeric(5,1),
  torque_nm                 numeric(5,1),
  cooling                   text check (cooling in ('air','oil','liquid','air_oil')),
  mileage_claimed_kmpl      numeric(4,1),
  mileage_real_kmpl         numeric(4,1),
  fuel_tank_l               numeric(4,1),
  seat_height_mm            integer check (seat_height_mm between 600 and 1000),
  kerb_weight_kg            integer check (kerb_weight_kg between 80 and 400),
  ground_clearance_mm       integer,
  abs                       text check (abs in ('none','single','dual')),
  traction_control          boolean not null default false,
  pillion_comfort           smallint check (pillion_comfort between 1 and 5),
  city_score                smallint check (city_score between 1 and 5),
  highway_score             smallint check (highway_score between 1 and 5),
  price_ex_showroom_inr     integer check (price_ex_showroom_inr > 0),
  price_on_road_chennai_inr integer check (price_on_road_chennai_inr > 0),
  price_checked_on          date,
  colours                   text[] not null default '{}',
  image_url                 text,
  source_url                text,
  is_active                 boolean not null default true,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index bikes_style_idx on public.bikes (style) where is_active;
create index bikes_price_idx on public.bikes (price_on_road_chennai_inr) where is_active;

create trigger bikes_updated_at before update on public.bikes
  for each row execute function public.set_updated_at();

alter table public.bikes enable row level security;

create policy "Anyone can read active bikes"
  on public.bikes for select
  to anon, authenticated
  using (is_active);

grant select on public.bikes to anon, authenticated;

-- ---------- showrooms -----------------------------------------------

create table public.showrooms (
  id         uuid primary key default gen_random_uuid(),
  brand      text not null,
  name       text not null,
  address    text not null,
  area       text,
  city       text not null default 'Chennai',
  lat        double precision check (lat between -90 and 90),
  lng        double precision check (lng between -180 and 180),
  phone      text,
  website    text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index showrooms_brand_idx on public.showrooms (brand) where is_active;

create trigger showrooms_updated_at before update on public.showrooms
  for each row execute function public.set_updated_at();

alter table public.showrooms enable row level security;

create policy "Anyone can read active showrooms"
  on public.showrooms for select
  to anon, authenticated
  using (is_active);

grant select on public.showrooms to anon, authenticated;

-- ---------- profiles ------------------------------------------------
-- One row per signed-in user, created automatically at sign-up.

create table public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  full_name          text,
  phone              text,
  height_cm          smallint check (height_cm between 120 and 220),
  weight_kg          smallint check (weight_kg between 30 and 200),
  marketing_consent  boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Users update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users delete own profile"
  on public.profiles for delete to authenticated
  using ((select auth.uid()) = id);

grant select, update, delete on public.profiles to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- saved bikes ---------------------------------------------

create table public.saved_bikes (
  user_id    uuid not null references auth.users (id) on delete cascade,
  bike_id    uuid not null references public.bikes (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, bike_id)
);

alter table public.saved_bikes enable row level security;

create policy "Users manage own saved bikes"
  on public.saved_bikes for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, delete on public.saved_bikes to authenticated;

-- ---------- rides (Ride Board) --------------------------------------

create table public.rides (
  id             uuid primary key default gen_random_uuid(),
  organiser_id   uuid not null references auth.users (id) on delete cascade,
  club_name      text,
  title          text not null check (char_length(title) between 5 and 120),
  description    text check (char_length(description) <= 4000),
  starts_at      timestamptz not null,
  meeting_point  text not null,
  meeting_lat    double precision,
  meeting_lng    double precision,
  route          text,
  distance_km    numeric(6,1),
  who_can_join   text not null default 'Any bike, any rider',
  seat_limit     integer check (seat_limit between 1 and 500),
  contact_phone  text,
  poster_url     text,
  status         text not null default 'pending'
                   check (status in ('pending','approved','rejected','cancelled')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index rides_upcoming_idx on public.rides (starts_at) where status = 'approved';
create index rides_organiser_idx on public.rides (organiser_id);

create trigger rides_updated_at before update on public.rides
  for each row execute function public.set_updated_at();

alter table public.rides enable row level security;

create policy "Anyone reads approved rides"
  on public.rides for select to anon, authenticated
  using (status = 'approved');

create policy "Organisers read own rides"
  on public.rides for select to authenticated
  using ((select auth.uid()) = organiser_id);

create policy "Admins read all rides"
  on public.rides for select to authenticated
  using ((select public.is_admin()));

create policy "Signed-in users post rides for review"
  on public.rides for insert to authenticated
  with check ((select auth.uid()) = organiser_id and status = 'pending');

create policy "Organisers edit own pending rides"
  on public.rides for update to authenticated
  using ((select auth.uid()) = organiser_id and status = 'pending')
  with check ((select auth.uid()) = organiser_id and status in ('pending','cancelled'));

create policy "Admins update any ride"
  on public.rides for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Organisers delete own rides"
  on public.rides for delete to authenticated
  using ((select auth.uid()) = organiser_id);

grant select on public.rides to anon;
grant select, insert, update, delete on public.rides to authenticated;

-- ---------- ride registrations --------------------------------------

create table public.ride_registrations (
  ride_id    uuid not null references public.rides (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  phone      text,
  bike_model text,
  created_at timestamptz not null default now(),
  primary key (ride_id, user_id)
);

alter table public.ride_registrations enable row level security;

create policy "Riders read own registrations"
  on public.ride_registrations for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Organisers read registrations for their rides"
  on public.ride_registrations for select to authenticated
  using (exists (
    select 1 from public.rides r
    where r.id = ride_id and r.organiser_id = (select auth.uid())
  ));

create policy "Riders register for approved rides"
  on public.ride_registrations for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.rides r where r.id = ride_id and r.status = 'approved')
  );

create policy "Riders cancel own registrations"
  on public.ride_registrations for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, delete on public.ride_registrations to authenticated;

-- Seat limits: block a registration once a ride is full.
create or replace function public.check_ride_capacity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  lim   integer;
  taken integer;
begin
  select seat_limit into lim from public.rides where id = new.ride_id for update;
  if lim is not null then
    select count(*) into taken from public.ride_registrations where ride_id = new.ride_id;
    if taken >= lim then
      raise exception 'This ride is full';
    end if;
  end if;
  return new;
end;
$$;

create trigger ride_registrations_capacity
  before insert on public.ride_registrations
  for each row execute function public.check_ride_capacity();

-- Public seat count without exposing who registered.
create or replace function public.ride_seats_taken(p_ride_id uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.ride_registrations rr
  join public.rides r on r.id = rr.ride_id
  where rr.ride_id = p_ride_id and r.status = 'approved';
$$;

revoke all on function public.ride_seats_taken(uuid) from public;
grant execute on function public.ride_seats_taken(uuid) to anon, authenticated;

-- ---------- test-ride requests --------------------------------------

create table public.test_ride_requests (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  bike_id        uuid not null references public.bikes (id),
  showroom_id    uuid references public.showrooms (id),
  preferred_date date,
  phone          text not null,
  status         text not null default 'requested'
                   check (status in ('requested','contacted','done','cancelled')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger test_ride_requests_updated_at before update on public.test_ride_requests
  for each row execute function public.set_updated_at();

alter table public.test_ride_requests enable row level security;

create policy "Users read own test-ride requests"
  on public.test_ride_requests for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users create own test-ride requests"
  on public.test_ride_requests for insert to authenticated
  with check ((select auth.uid()) = user_id and status = 'requested');

create policy "Users delete own test-ride requests"
  on public.test_ride_requests for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, delete on public.test_ride_requests to authenticated;

-- ---------- chat sessions (server only) -----------------------------
-- What the rider asked for and what we recommended. Written by the server
-- with the secret key; never readable from the browser.

create table public.chat_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users (id) on delete cascade,
  needs         jsonb not null default '{}'::jsonb,
  shortlist     uuid[] not null default '{}',
  final_bike_id uuid references public.bikes (id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger chat_sessions_updated_at before update on public.chat_sessions
  for each row execute function public.set_updated_at();

alter table public.chat_sessions enable row level security;
-- no policies and no grants for anon/authenticated: server access only
