'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { updateOwnTripAction } from '@/lib/actions/trip.actions';
import { toDateInputValue, daysBetweenInclusive } from '@/lib/utils';
import type { Trip, TripStatus } from '@/types/database.types';

const STATUS_OPTIONS: { value: TripStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'upcoming', label: 'Akan Datang' },
  { value: 'completed', label: 'Selesai' },
  { value: 'archived', label: 'Diarsipkan' },
];

export function EditTripDialog({ trip }: { trip: Trip }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(trip.title);
  const [status, setStatus] = useState<TripStatus>(trip.status);
  // Dinormalisasi ke "YYYY-MM-DD" supaya kompatibel dengan <input type="date">
  // walau API mengembalikan format ISO datetime penuh.
  const [startDate, setStartDate] = useState(toDateInputValue(trip.start_date));
  const [endDate, setEndDate] = useState(toDateInputValue(trip.end_date));
  const [budget, setBudget] = useState(trip.budget_estimate?.toString() ?? '');

  // Kalau durasi trip berubah dari itinerary yang sudah tersimpan, itinerary
  // lama tidak otomatis menyesuaikan — user diberi tahu lewat banner peringatan.
  const originalDayCount = trip.itinerary?.length ?? 0;
  const newDayCount = startDate && endDate ? daysBetweenInclusive(startDate, endDate) : originalDayCount;
  const durationChanged = originalDayCount > 0 && newDayCount !== originalDayCount;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateOwnTripAction(trip.id, {
        title,
        status,
        start_date: startDate || null,
        end_date: endDate || null,
        budget_estimate: budget ? Number(budget) : null,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex-1">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Judul Trip</Label>
            <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" required />
          </div>

          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as TripStatus)}>
              <SelectTrigger className="mt-1.5">
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="edit-start">Tanggal Mulai</Label>
              <Input id="edit-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="edit-end">Tanggal Selesai</Label>
              <Input id="edit-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1.5" />
            </div>
          </div>

          {startDate && endDate && (
            <p className="text-xs text-muted-foreground">
              Durasi: {newDayCount} hari{originalDayCount > 0 ? ` (itinerary tersimpan saat ini: ${originalDayCount} hari)` : ''}.
            </p>
          )}

          {durationChanged && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p>
                  Durasi berubah dari <strong>{originalDayCount} hari</strong> menjadi{' '}
                  <strong>{newDayCount} hari</strong>. Itinerary yang sudah dibuat AI Planner{' '}
                  <strong>tidak akan otomatis menyesuaikan</strong> (aktivitas & destinasi tetap sama).
                </p>
                <p className="mt-1">
                  Kalau memang butuh jadwal baru sesuai durasi ini, sebaiknya{' '}
                  <Link href="/ai-planner" className="font-semibold underline">
                    buat itinerary baru lewat AI Planner
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="edit-budget">Estimasi Budget (Rp)</Label>
            <Input id="edit-budget" type="number" min={0} value={budget} onChange={(e) => setBudget(e.target.value)} className="mt-1.5" />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" variant="gradient" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
