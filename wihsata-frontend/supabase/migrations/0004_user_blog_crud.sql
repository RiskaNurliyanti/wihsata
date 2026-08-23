-- =====================================================================
-- Wihsata — Migration 0004: User dapat CRUD artikel blog miliknya sendiri
-- Sebelumnya hanya admin yang bisa insert/update/delete artikel (policy
-- "articles_admin_all"). Sekarang user biasa juga bisa menulis, mengedit,
-- dan menghapus artikelnya sendiri; admin tetap bisa mengelola semua.
-- =====================================================================

-- Publik hanya lihat artikel published, TAPI penulis harus bisa lihat draft
-- miliknya sendiri juga (untuk halaman "Artikel Saya").
drop policy if exists "articles_select_published" on public.articles;
create policy "articles_select_published_or_own" on public.articles for select
  using (
    is_published = true
    or auth.uid() = author_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

drop policy if exists "articles_admin_all" on public.articles;

create policy "articles_insert_own" on public.articles for insert
  with check (auth.uid() = author_id);

create policy "articles_update_own_or_admin" on public.articles for update
  using (
    auth.uid() = author_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "articles_delete_own_or_admin" on public.articles for delete
  using (
    auth.uid() = author_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
