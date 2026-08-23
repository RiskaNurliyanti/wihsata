-- =====================================================================
-- Wihsata — Migration 0007: Perbaikan GRANT Permission
-- Menjawab error "permission denied for table profiles" — ini error GRANT
-- level Postgres (beda dari RLS), berarti role anon/authenticated/service_role
-- tidak punya privilege dasar di tabel tersebut. Kemungkinan tabel dibuat
-- lewat SQL Editor tanpa ter-apply default privileges otomatis dari Supabase.
-- Aman dijalankan berkali-kali — RLS policy yang sudah ada tetap berlaku
-- penuh untuk role anon/authenticated, ini cuma memastikan grant dasarnya ada.
-- =====================================================================

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant all privileges on all tables in schema public to service_role;

grant usage, select on all sequences in schema public to anon, authenticated, service_role;
grant execute on all functions in schema public to anon, authenticated, service_role;

-- Supaya tabel yang dibuat SETELAH ini juga otomatis dapat grant yang sama,
-- tanpa perlu jalankan ulang script ini tiap bikin tabel baru.
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant select on tables to anon;
alter default privileges in schema public grant all privileges on tables to service_role;
alter default privileges in schema public grant usage, select on sequences to anon, authenticated, service_role;
