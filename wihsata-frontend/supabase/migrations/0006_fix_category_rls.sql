-- =====================================================================
-- Wihsata — Migration 0006: Perbaikan RLS Categories & Districts
-- Menjawab masalah: kategori yang ditambahkan admin tidak muncul di
-- filter Explore publik. Kemungkinan besar RLS sempat aktif di tabel
-- categories/districts (mis. lewat toggle "Enable RLS" di Supabase
-- dashboard) tanpa ada policy SELECT — akibatnya Postgres default-deny
-- semua akses kecuali service role (dipakai admin), sementara halaman
-- publik pakai client biasa yang kena RLS dan dapat 0 hasil.
-- =====================================================================

alter table public.categories enable row level security;
alter table public.districts enable row level security;

drop policy if exists "categories_select_all" on public.categories;
create policy "categories_select_all" on public.categories for select using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

drop policy if exists "districts_select_all" on public.districts;
create policy "districts_select_all" on public.districts for select using (true);

drop policy if exists "districts_admin_write" on public.districts;
create policy "districts_admin_write" on public.districts for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
