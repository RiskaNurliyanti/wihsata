-- =====================================================================
-- Wihsata — Migration 0005: Info Akses Kapal/Penyeberangan
-- Menjawab masalah: destinasi di pulau muncul "dekat" di fitur Nearby /
-- direkomendasikan AI Planner padahal butuh naik kapal dulu, karena jarak
-- yang dipakai sebelumnya cuma garis lurus (tidak tahu ada laut di antaranya).
-- =====================================================================

create type destination_access_type as enum ('darat', 'kapal', 'kombinasi');

alter table public.destinations
  add column access_type destination_access_type not null default 'darat',
  add column departure_port text,
  add column crossing_duration_minutes integer,
  add column crossing_cost_estimate numeric(12,2),
  add column crossing_notes text;

comment on column public.destinations.access_type is
  'darat = bisa dijangkau jalan biasa; kapal = wajib naik kapal/perahu; kombinasi = darat lalu nyambung kapal';
comment on column public.destinations.departure_port is
  'Nama pelabuhan/dermaga keberangkatan, mis. "Pelabuhan Kapal Feri Kariangau"';
comment on column public.destinations.crossing_duration_minutes is
  'Estimasi lama penyeberangan dalam menit';
comment on column public.destinations.crossing_cost_estimate is
  'Estimasi biaya kapal per orang (Rupiah)';

-- Sertakan kolom baru di RPC nearby_destinations supaya info penyeberangan
-- ikut muncul di hasil pencarian "wisata terdekat", bukan cuma di halaman detail.
-- CATATAN: PostgreSQL tidak mengizinkan CREATE OR REPLACE FUNCTION mengubah
-- struktur kolom hasil (menambah OUT parameter baru) pada function yang
-- sudah ada — makanya function lama harus di-drop dulu.
drop function if exists public.nearby_destinations(double precision, double precision, double precision, integer);

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
  distance_km double precision,
  access_type destination_access_type,
  departure_port text,
  crossing_duration_minutes integer
)
language sql stable
as $$
  select
    d.id, d.slug, d.name, d.category_id, d.cover_image_url, d.rating,
    d.latitude, d.longitude,
    round((st_distance(d.geo_location, st_setsrid(st_makepoint(lng, lat), 4326)::geography) / 1000)::numeric, 2) as distance_km,
    d.access_type, d.departure_port, d.crossing_duration_minutes
  from public.destinations d
  where st_dwithin(d.geo_location, st_setsrid(st_makepoint(lng, lat), 4326)::geography, radius_km * 1000)
  order by distance_km asc
  limit limit_count;
$$;
