import type { Metadata } from 'next';
import { PlannerForm } from '@/components/ai-planner/planner-form';
import { apiFetch } from '@/lib/api/client';
import type { Category } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'AI Trip Planner',
  description: 'Buat itinerary perjalanan otomatis dengan AI sesuai budget, tanggal, dan minatmu.',
};

export default async function AiPlannerPage() {
  let categories: Category[] = [];
  try {
    const res = await apiFetch<{ data: Category[] }>('/categories', { skipAuth: true });
    categories = res.data;
  } catch (error) {
    console.error('AiPlannerPage: gagal memuat kategori:', error);
  }

  return (
    <div className="container py-10 sm:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
          AI Trip Planner
        </span>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Biarkan AI Susun Itinerary Perjalananmu
        </h1>
        <p className="mt-3 text-muted-foreground">
          Isi preferensi perjalananmu, dan dapatkan rencana lengkap: rute, waktu, dan estimasi biaya dalam hitungan detik.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <PlannerForm categories={categories} />
      </div>
    </div>
  );
}
