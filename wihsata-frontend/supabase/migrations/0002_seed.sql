-- =====================================================================
-- Seed data — kategori, kabupaten, dan contoh destinasi
-- =====================================================================

insert into public.categories (name, slug, icon) values
  ('Pantai', 'pantai', 'waves'),
  ('Gunung', 'gunung', 'mountain'),
  ('Air Terjun', 'air-terjun', 'droplets'),
  ('Danau', 'danau', 'droplet'),
  ('Kuliner', 'kuliner', 'utensils'),
  ('Budaya & Sejarah', 'budaya-sejarah', 'landmark'),
  ('Taman & Hutan', 'taman-hutan', 'trees'),
  ('Pulau', 'pulau', 'palmtree'),
  ('Desa Wisata', 'desa-wisata', 'home'),
  ('Camping & Outdoor', 'camping-outdoor', 'tent'),
  ('Waterpark & Kolam', 'waterpark-kolam', 'waves'),
  ('Belanja & Oleh-oleh', 'belanja-oleh-oleh', 'shopping-bag')
on conflict (slug) do nothing;

insert into public.districts (name, province) values
  ('Samarinda', 'Kalimantan Timur'),
  ('Balikpapan', 'Kalimantan Timur'),
  ('Kutai Kartanegara', 'Kalimantan Timur'),
  ('Yogyakarta', 'Daerah Istimewa Yogyakarta'),
  ('Bandung', 'Jawa Barat'),
  ('Denpasar', 'Bali')
on conflict do nothing;

-- Contoh destinasi di Samarinda (sesuai lokasi target awal)
insert into public.destinations (
  slug, name, description, category_id, district_id,
  latitude, longitude, address, price_range, facilities,
  cover_image_url, rating, review_count, safety_score, is_featured
)
select
  'air-terjun-tanah-merah',
  'Air Terjun Tanah Merah',
  'Air terjun alami dengan kolam jernih, cocok untuk berenang dan piknik keluarga.',
  c.id, d.id,
  -0.6833, 117.2333,
  'Samarinda Utara, Kota Samarinda, Kalimantan Timur',
  'Rp 10.000 - Rp 15.000',
  array['Parkir','Toilet','Warung','Gazebo'],
  'https://images.unsplash.com/photo-1508261303786-0868e6c7be13',
  4.5, 128, 4.2, true
from public.categories c, public.districts d
where c.slug = 'air-terjun' and d.name = 'Samarinda'
on conflict (slug) do nothing;

insert into public.destinations (
  slug, name, description, category_id, district_id,
  latitude, longitude, address, price_range, facilities,
  cover_image_url, rating, review_count, safety_score, is_featured
)
select
  'taman-samarendah',
  'Taman Samarendah',
  'Taman kota tepi Sungai Mahakam, spot favorit untuk kuliner malam dan bersantai.',
  c.id, d.id,
  -0.4931, 117.1436,
  'Tepian Mahakam, Samarinda',
  'Gratis',
  array['Parkir','Toilet','Kuliner Malam','Spot Foto'],
  'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d',
  4.3, 342, 4.6, true
from public.categories c, public.districts d
where c.slug = 'taman-hutan' and d.name = 'Samarinda'
on conflict (slug) do nothing;
