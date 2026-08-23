import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { DestinationForm } from '@/components/admin/destination-form';
import { createDestinationAction } from '@/lib/actions/admin.actions';
import type { Category, District } from '@/types/database.types';

export const metadata: Metadata = { title: 'Tambah Destinasi — Admin' };

export default async function NewDestinationPage() {
  const token = getServerToken();
  const [categoriesRes, districtsRes] = await Promise.all([
    apiFetch<{ data: Category[] }>('/categories', { token }),
    apiFetch<{ data: District[] }>('/districts', { token }),
  ]);

  return (
    <div>
      <Link href="/admin/destinations" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar destinasi
      </Link>
      <h1 className="font-display text-2xl font-bold text-foreground">Tambah Destinasi Baru</h1>
      <p className="mt-1 text-sm text-muted-foreground">Isi detail destinasi wisata yang akan ditambahkan.</p>

      <div className="mt-6 max-w-2xl">
        <DestinationForm
          action={createDestinationAction}
          categories={categoriesRes.data}
          districts={districtsRes.data}
          submitLabel="Tambah Destinasi"
        />
      </div>
    </div>
  );
}
