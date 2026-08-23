import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { DestinationForm } from '@/components/admin/destination-form';
import { updateDestinationAction } from '@/lib/actions/admin.actions';
import type { Category, District, Destination } from '@/types/database.types';

export const metadata: Metadata = { title: 'Edit Destinasi — Admin' };

interface EditDestinationPageProps {
  // Nama param dipertahankan `id` (tidak ganti nama folder) tapi isinya
  // sekarang SLUG — sesuai route model binding {destination:slug} di Laravel.
  params: { id: string };
}

export default async function EditDestinationPage({ params }: EditDestinationPageProps) {
  const token = getServerToken();
  if (!token) notFound();

  let destination: Destination;
  try {
    const res = await apiFetch<{ data: Destination }>(`/destinations/${params.id}`, { token });
    destination = res.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const [categoriesRes, districtsRes] = await Promise.all([
    apiFetch<{ data: Category[] }>('/categories', { token }),
    apiFetch<{ data: District[] }>('/districts', { token }),
  ]);

  // Bind slug destinasi ke Server Action agar signature-nya cocok dengan
  // useFormState di client: (prevState, formData) => Promise<State>.
  const updateActionWithId = updateDestinationAction.bind(null, destination.slug);

  return (
    <div>
      <Link href="/admin/destinations" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar destinasi
      </Link>
      <h1 className="font-display text-2xl font-bold text-foreground">Edit Destinasi</h1>
      <p className="mt-1 text-sm text-muted-foreground">{destination.name}</p>

      <div className="mt-6 max-w-2xl">
        <DestinationForm
          action={updateActionWithId}
          categories={categoriesRes.data}
          districts={districtsRes.data}
          destination={destination}
          submitLabel="Simpan Perubahan"
        />
      </div>
    </div>
  );
}
