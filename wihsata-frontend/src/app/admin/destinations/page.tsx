import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { Button } from '@/components/ui/button';
import { AdminDestinationsTable } from '@/components/admin/admin-destinations-table';
import type { Destination } from '@/types/database.types';

export const metadata: Metadata = { title: 'Kelola Destinasi — Admin' };

async function getDestinations(): Promise<Destination[]> {
  const token = getServerToken();
  if (!token) return [];

  try {
    const res = await apiFetch<{ data: Destination[] }>('/destinations?per_page=100&sort=newest', { token });
    return res.data;
  } catch {
    return [];
  }
}

export default async function AdminDestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Kelola Destinasi</h1>
          <p className="mt-1 text-sm text-muted-foreground">{destinations.length} destinasi terdaftar.</p>
        </div>
        <Link href="/admin/destinations/new" className="w-full sm:w-auto">
          <Button variant="gradient" className="w-full sm:w-auto">
            <Plus className="h-4 w-4" /> Tambah Destinasi
          </Button>
        </Link>
      </div>

      <AdminDestinationsTable destinations={destinations} />
    </div>
  );
}
