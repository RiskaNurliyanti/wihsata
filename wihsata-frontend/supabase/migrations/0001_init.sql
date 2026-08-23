-- =====================================================================
-- Wihsata — Initial Schema
-- Jalankan via: supabase db push  (atau paste ke SQL editor Supabase)
-- =====================================================================

create extension if not exists "uuid-ossp";
create extension if not exists postgis;          -- untuk query geospasial (nearby)
create extension if not exists pg_trgm;           -- untuk full-text search fuzzy

-- ── ENUM TYPES ────────────────────────────────────────────────────────
create type subscription_tier as enum ('demo', 'pro');
create type subscription_status as enum ('active', 'canceled', 'expired', 'trialing');
create type trip_status as enum ('draft', 'upcoming', 'completed', 'archived');

-- ── USERS (extends auth.users) ───────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  avatar_url text,
  bio text,
  home_city text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── CATEGORY & DISTRICT (referensi) ──────────────────────────────────
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,          -- Pantai, Gunung, Air Terjun, Kuliner, dll
  slug text not null unique,
  icon text,
  created_at timestamptz not null default now()
);

create table public.districts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,                 -- Kabupaten/Kota
  province text not null,
  created_at timestamptz not null default now()
);

-- ── DESTINATIONS (data utama) ────────────────────────────────────────
create table public.destinations (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  district_id uuid references public.districts(id) on delete set null,
  latitude double precision not null,
  longitude double precision not null,
  geo_location geography(Point, 4326)
    generated always as (
      st_setsrid(st_makepoint(longitude, latitude), 4326)::geography
    ) stored,
  address text,
  price_range text,                   -- e.g. "Rp 10.000 - Rp 25.000"
  opening_hours jsonb,                -- {"mon": "08:00-17:00", ...}
  facilities text[],                  -- {"Parkir","Toilet","Warung"}
  cover_image_url text,
  gallery_urls text[],
  google_maps_url text,
  rating numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0,
  safety_score numeric(2,1) default 4.0,
  is_featured boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_destinations_geo on public.destinations using gist (geo_location);
create index idx_destinations_category on public.destinations(category_id);
create index idx_destinations_district on public.destinations(district_id);
create index idx_destinations_name_trgm on public.destinations using gin (name gin_trgm_ops);

-- ── REVIEWS ───────────────────────────────────────────────────────────
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  destination_id uuid not null references public.destinations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  photo_urls text[],
  created_at timestamptz not null default now(),
  unique (destination_id, user_id)
);

-- ── TRIPS (My Trip / itinerary tersimpan) ────────────────────────────
create table public.trips (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  start_date date,
  end_date date,
  status trip_status not null default 'draft',
  budget_estimate numeric(12,2),
  preferences jsonb,                  -- input asli user ke AI planner
  itinerary jsonb not null default '[]'::jsonb,  -- hasil AI: [{day, items:[...]}]
  cover_image_url text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trip_destinations (
  id uuid primary key default uuid_generate_v4(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  destination_id uuid not null references public.destinations(id) on delete cascade,
  day_number integer not null default 1,
  visit_order integer not null default 1,
  notes text,
  created_at timestamptz not null default now()
);

-- ── FAVORITES / SAVED PLACES ──────────────────────────────────────────
create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  destination_id uuid not null references public.destinations(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, destination_id)
);

-- ── COMMUNITY POSTS ────────────────────────────────────────────────────
create table public.community_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  destination_id uuid references public.destinations(id) on delete set null,
  caption text,
  image_urls text[] not null default '{}',
  like_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.post_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.post_comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- ── BLOG / ARTICLES ────────────────────────────────────────────────────
create table public.articles (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  category text,                       -- Tips Travel, Solo Travel, Budget Travel, dll
  author_id uuid references public.profiles(id) on delete set null,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- ── SUBSCRIPTIONS (Demo vs Pro) ────────────────────────────────────────
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  tier subscription_tier not null default 'demo',
  status subscription_status not null default 'active',
  current_period_end timestamptz,
  ai_generation_count_today integer not null default 0,
  ai_generation_reset_at date not null default current_date,
  trips_saved_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(12,2) not null,
  currency text not null default 'IDR',
  status text not null default 'pending',   -- pending | paid | failed | refunded
  provider text,                             -- midtrans | xendit | manual
  provider_ref text,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- TRIGGERS
-- =====================================================================

-- auto-create profile + demo subscription saat user daftar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  insert into public.subscriptions (user_id, tier)
  values (new.id, 'demo');

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_profiles before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at_destinations before update on public.destinations
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at_trips before update on public.trips
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at_subscriptions before update on public.subscriptions
  for each row execute procedure public.set_updated_at();

-- recompute destination rating saat ada review baru
create or replace function public.recompute_destination_rating()
returns trigger as $$
begin
  update public.destinations d
  set rating = coalesce((select round(avg(rating)::numeric, 1) from public.reviews where destination_id = d.id), 0),
      review_count = (select count(*) from public.reviews where destination_id = d.id)
  where d.id = coalesce(new.destination_id, old.destination_id);
  return null;
end;
$$ language plpgsql;

create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute procedure public.recompute_destination_rating();

-- =====================================================================
-- RPC: nearby destinations (dipakai halaman Nearby)
-- =====================================================================
create or replace function public.nearby_destinations(
  lat double precision,
  lng double precision,
  radius_km double precision default 25,
  limit_count integer default 50
)
returns table (
  id uuid,
  slug text,
  name text,
  category_id uuid,
  cover_image_url text,
  rating numeric,
  latitude double precision,
  longitude double precision,
  distance_km double precision
)
language sql stable
as $$
  select
    d.id, d.slug, d.name, d.category_id, d.cover_image_url, d.rating,
    d.latitude, d.longitude,
    round((st_distance(d.geo_location, st_setsrid(st_makepoint(lng, lat), 4326)::geography) / 1000)::numeric, 2) as distance_km
  from public.destinations d
  where st_dwithin(d.geo_location, st_setsrid(st_makepoint(lng, lat), 4326)::geography, radius_km * 1000)
  order by distance_km asc
  limit limit_count;
$$;

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.reviews enable row level security;
alter table public.trips enable row level security;
alter table public.trip_destinations enable row level security;
alter table public.favorites enable row level security;
alter table public.community_posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.articles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;

-- profiles: publik bisa lihat, hanya pemilik bisa update
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- destinations: publik bisa lihat, hanya admin bisa CUD
create policy "destinations_select_all" on public.destinations for select using (true);
create policy "destinations_admin_write" on public.destinations for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- reviews: publik lihat, user login boleh tulis punya sendiri
create policy "reviews_select_all" on public.reviews for select using (true);
create policy "reviews_insert_own" on public.reviews for insert with check (auth.uid() = user_id);
create policy "reviews_update_own" on public.reviews for update using (auth.uid() = user_id);
create policy "reviews_delete_own" on public.reviews for delete using (auth.uid() = user_id);

-- trips: strictly private ke pemilik (kecuali is_public)
create policy "trips_select_own_or_public" on public.trips for select
  using (auth.uid() = user_id or is_public = true);
create policy "trips_insert_own" on public.trips for insert with check (auth.uid() = user_id);
create policy "trips_update_own" on public.trips for update using (auth.uid() = user_id);
create policy "trips_delete_own" on public.trips for delete using (auth.uid() = user_id);

create policy "trip_destinations_via_trip" on public.trip_destinations for all
  using (exists (select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid()));

-- favorites: privat per user
create policy "favorites_own" on public.favorites for all using (auth.uid() = user_id);

-- community: publik lihat, user login posting punya sendiri
create policy "posts_select_all" on public.community_posts for select using (true);
create policy "posts_insert_own" on public.community_posts for insert with check (auth.uid() = user_id);
create policy "posts_update_own" on public.community_posts for update using (auth.uid() = user_id);
create policy "posts_delete_own" on public.community_posts for delete using (auth.uid() = user_id);

create policy "likes_select_all" on public.post_likes for select using (true);
create policy "likes_own" on public.post_likes for all using (auth.uid() = user_id);

create policy "comments_select_all" on public.post_comments for select using (true);
create policy "comments_insert_own" on public.post_comments for insert with check (auth.uid() = user_id);
create policy "comments_delete_own" on public.post_comments for delete using (auth.uid() = user_id);

-- articles: publik lihat yg published, admin CUD semua
create policy "articles_select_published" on public.articles for select using (is_published = true);
create policy "articles_admin_all" on public.articles for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- subscriptions: privat per user
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
create policy "subscriptions_update_own" on public.subscriptions for update using (auth.uid() = user_id);

-- payments: privat per user
create policy "payments_select_own" on public.payments for select using (auth.uid() = user_id);
