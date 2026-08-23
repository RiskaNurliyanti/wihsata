'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateTripAction } from '@/lib/actions/admin.actions';
import type { AdminTripFormValues } from '@/lib/validations/trip.schema';

const STATUS_OPTIONS: { value: AdminTripFormValues['status']; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

interface AdminTripFormProps {
  tripId: string;
  defaultValues: AdminTripFormValues;
}

export function AdminTripForm({ tripId, defaultValues }: AdminTripFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState<AdminTripFormValues>(defaultValues);

  function handleChange<K extends keyof AdminTripFormValues>(key: K, value: AdminTripFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setShowSuccess(false);

    startTransition(async () => {
      const result = await updateTripAction(tripId, form);

      if (result?.error) {
        setErrors(result.error as Record<string, string[]>);
        return;
      }

      // Root-cause fix (Masalah 3 — "CRUD belum stabil"): sebelumnya di sini
      // TIDAK ADA penanganan apa pun untuk kasus sukses, jadi setelah klik
      // "Simpan Perubahan" yang berhasil, tidak ada tanda apa pun ke user —
      // terlihat seperti "tidak ngapa-ngapain" padahal sebenarnya sukses.
      setShowSuccess(true);
      router.refresh(); // ambil ulang data server (revalidatePath saja tidak cukup
                         // untuk memaksa Client Component re-render di halaman ini)
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors._form && <p className="text-sm text-destructive">{errors._form[0]}</p>}
      {showSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Perubahan berhasil disimpan.
        </div>
      )}

      <div>
        <Label htmlFor="title">Judul Trip</Label>
        <Input id="title" value={form.title} onChange={(e) => handleChange('title', e.target.value)} />
        {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title[0]}</p>}
      </div>

      <div>
        <Label>Status</Label>
        <Select value={form.status} onValueChange={(v) => handleChange('status', v as AdminTripFormValues['status'])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="start_date">Tanggal Mulai</Label>
          <Input
            id="start_date"
            type="date"
            value={form.start_date ?? ''}
            onChange={(e) => handleChange('start_date', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="end_date">Tanggal Selesai</Label>
          <Input
            id="end_date"
            type="date"
            value={form.end_date ?? ''}
            onChange={(e) => handleChange('end_date', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="budget_estimate">Estimasi Budget (Rp)</Label>
        <Input
          id="budget_estimate"
          type="number"
          min={0}
          value={form.budget_estimate ?? ''}
          onChange={(e) => handleChange('budget_estimate', Number(e.target.value))}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={form.is_public}
          onChange={(e) => handleChange('is_public', e.target.checked)}
          className="h-4 w-4 rounded border-input text-primary-600 focus:ring-primary-500"
        />
        Publikasikan trip ini (bisa dilihat orang lain)
      </label>

      <div className="flex gap-3">
        <Button type="submit" variant="gradient" disabled={isPending}>
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}
