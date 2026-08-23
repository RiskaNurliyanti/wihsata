-- =====================================================================
-- Wihsata — Migration 0008: Sertakan Harga di RPC nearby_destinations
-- Menjawab masalah: AI Planner mengarang sendiri estimasi biaya (kadang
-- Rp 0 atau asal tebak) karena RPC nearby_destinations tidak pernah
-- mengirim price_range/crossing_cost_estimate ke kode yang menyusun
-- prompt AI. Sekarang data harga asli dari admin ikut dikirim.
-- =====================================================================

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
  crossing_duration_minutes integer,
  price_range text,
  crossing_cost_estimate numeric
)
language sql stable
as $$
  select
    d.id, d.slug, d.name, d.category_id, d.cover_image_url, d.rating,
    d.latitude, d.longitude,
    round((st_distance(d.geo_location, st_setsrid(st_makepoint(lng, lat), 4326)::geography) / 1000)::numeric, 2) as distance_km,
    d.access_type, d.departure_port, d.crossing_duration_minutes,
    d.price_range, d.crossing_cost_estimate
  from public.destinations d
  where st_dwithin(d.geo_location, st_setsrid(st_makepoint(lng, lat), 4326)::geography, radius_km * 1000)
  order by distance_km asc
  limit limit_count;
$$;
