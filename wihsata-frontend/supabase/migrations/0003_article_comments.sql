-- =====================================================================
-- Wihsata — Migration 0003: Article Comments (komentar blog)
-- =====================================================================

create table public.article_comments (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid not null references public.articles(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index idx_article_comments_article on public.article_comments(article_id);

alter table public.article_comments enable row level security;

create policy "article_comments_select_all" on public.article_comments for select using (true);
create policy "article_comments_insert_own" on public.article_comments for insert with check (auth.uid() = user_id);
create policy "article_comments_delete_own_or_admin" on public.article_comments for delete
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- =====================================================================
-- Perbaikan policy lama: admin perlu bisa moderasi (edit/hapus) postingan
-- & komentar komunitas milik orang lain, bukan cuma pemilik post.
-- Policy lama di 0001_init.sql hanya mengizinkan pemilik (auth.uid() = user_id).
-- =====================================================================

drop policy if exists "posts_update_own" on public.community_posts;
create policy "posts_update_own_or_admin" on public.community_posts for update
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

drop policy if exists "posts_delete_own" on public.community_posts;
create policy "posts_delete_own_or_admin" on public.community_posts for delete
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

drop policy if exists "comments_delete_own" on public.post_comments;
create policy "comments_delete_own_or_admin" on public.post_comments for delete
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Admin juga perlu bisa CRUD penuh atas destinasi (create/update) —
-- policy "destinations_admin_write" di 0001_init.sql sudah mencakup ini
-- untuk semua operasi (all), jadi tidak perlu diubah.

