import type { Metadata } from 'next';
import { apiFetch } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { CategoryManager } from '@/components/admin/category-manager';
import type { Category } from '@/types/database.types';

export const metadata: Metadata = { title: 'Kelola Kategori — Admin' };

export default async function AdminCategoriesPage() {
  const token = getServerToken();
  const res = await apiFetch<{ data: Category[] }>('/categories', { token });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Kelola Kategori</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Tambah, ubah, atau hapus kategori destinasi (mis. Pantai, Danau, Gunung) — sama seperti daftar Kabupaten/Kota.
      </p>

      <div className="mt-6">
        <CategoryManager initialCategories={res.data} />
      </div>
    </div>
  );
}
