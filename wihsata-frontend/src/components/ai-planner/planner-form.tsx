'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Users, Wallet, MapPin, AlertCircle, Loader2, Navigation, Car, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aiPlannerSchema, INTEREST_OPTIONS, TRANSPORT_MODE_OPTIONS, type AiPlannerFormValues } from '@/lib/validations/ai-planner.schema';
import { useAiItinerary } from '@/hooks/use-ai-itinerary';
import { ItineraryResult } from './itinerary-result';
import { apiFetch, ApiError, getClientToken } from '@/lib/api/client';
import { cn } from '@/lib/utils';

interface PlannerFormProps {
  categories: { name: string; slug: string }[];
}

export function PlannerForm({ categories }: PlannerFormProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [customInterest, setCustomInterest] = useState('');
  const { mutate, data, isPending, error, reset: resetMutation } = useAiItinerary();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AiPlannerFormValues>({
    resolver: zodResolver(aiPlannerSchema),
    defaultValues: {
      travelers_count: 2,
      budget_total: 1_000_000,
      interests: [],
      travel_pace: 'normal',
      transport_mode: 'private_vehicle',
      departure_time: '08:00',
      return_time: '18:00',
    },
  });

  const selectedInterests = watch('interests');

  // Gabungkan minat gaya hidup (statis) + kategori destinasi asli dari database,
  // supaya pilihan minat selalu sinkron dengan kategori yang admin kelola.
  const combinedOptions = [
    ...INTEREST_OPTIONS,
    ...categories
      .filter((c) => !INTEREST_OPTIONS.some((opt) => opt.label.toLowerCase().includes(c.name.toLowerCase())))
      .map((c) => ({ value: c.slug, label: c.name })),
  ];

  useEffect(() => {
    if (!getClientToken()) {
      setIsAuthenticated(false);
      return;
    }

    apiFetch('/auth/me')
      .then(() => setIsAuthenticated(true))
      .catch((err) => {
        if (!(err instanceof ApiError && err.status === 401)) {
          console.error('PlannerForm: gagal cek status login:', err);
        }
        setIsAuthenticated(false);
      });
  }, []);

  function toggleInterest(value: string) {
    const current = selectedInterests ?? [];
    setValue(
      'interests',
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      { shouldValidate: true }
    );
  }

  function addCustomInterest() {
    const value = customInterest.trim();
    if (!value) return;
    const current = selectedInterests ?? [];
    if (!current.includes(value)) {
      setValue('interests', [...current, value], { shouldValidate: true });
    }
    setCustomInterest('');
  }

  function onSubmit(values: AiPlannerFormValues) {
    resetMutation();
    mutate(values);
  }

  if (data) {
    return <ItineraryResult result={data} onReset={resetMutation} />;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {isAuthenticated === false && (
          <div className="mb-5 flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Anda perlu <a href="/auth/login" className="font-semibold underline">login</a> terlebih dahulu untuk menggunakan AI Planner.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="origin_location">
                <Navigation className="mr-1 inline h-3.5 w-3.5" /> Berangkat Dari
              </Label>
              <Input id="origin_location" placeholder="mis. Samarinda" {...register('origin_location')} className="mt-1.5" />
              <p className="mt-1 text-xs text-muted-foreground">Wajib diisi — dipakai AI untuk menghitung waktu tempuh & jam berangkat.</p>
              {errors.origin_location && <p className="mt-1 text-xs text-destructive">{errors.origin_location.message}</p>}
            </div>
            <div>
              <Label htmlFor="destination_area">
                <MapPin className="mr-1 inline h-3.5 w-3.5" /> Daerah Tujuan
              </Label>
              <Input id="destination_area" placeholder="mis. Yogyakarta, Bali, Biduk-Biduk" {...register('destination_area')} className="mt-1.5" />
              {errors.destination_area && <p className="mt-1 text-xs text-destructive">{errors.destination_area.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="start_date">Tanggal Mulai</Label>
              <Input id="start_date" type="date" {...register('start_date')} className="mt-1.5" />
              {errors.start_date && <p className="mt-1 text-xs text-destructive">{errors.start_date.message}</p>}
            </div>
            <div>
              <Label htmlFor="end_date">Tanggal Selesai</Label>
              <Input id="end_date" type="date" {...register('end_date')} className="mt-1.5" />
              {errors.end_date && <p className="mt-1 text-xs text-destructive">{errors.end_date.message}</p>}
            </div>
          </div>

          {/* Jam berangkat/pulang wajib diisi — dipakai AI untuk menjadwalkan
              hari pertama & terakhir secara realistis. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="departure_time">
                <Clock className="mr-1 inline h-3.5 w-3.5" /> Jam Keberangkatan
              </Label>
              <Input id="departure_time" type="time" {...register('departure_time')} className="mt-1.5" />
              <p className="mt-1 text-xs text-muted-foreground">Jam mulai perjalanan di hari pertama.</p>
              {errors.departure_time && <p className="mt-1 text-xs text-destructive">{errors.departure_time.message}</p>}
            </div>
            <div>
              <Label htmlFor="return_time">
                <Clock className="mr-1 inline h-3.5 w-3.5" /> Jam Kepulangan
              </Label>
              <Input id="return_time" type="time" {...register('return_time')} className="mt-1.5" />
              <p className="mt-1 text-xs text-muted-foreground">Jam target pulang di hari terakhir.</p>
              {errors.return_time && <p className="mt-1 text-xs text-destructive">{errors.return_time.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="travelers_count">
                <Users className="mr-1 inline h-3.5 w-3.5" /> Jumlah Traveler
              </Label>
              <Input id="travelers_count" type="number" min={1} max={30} {...register('travelers_count')} className="mt-1.5" />
              {errors.travelers_count && <p className="mt-1 text-xs text-destructive">{errors.travelers_count.message}</p>}
            </div>
            <div>
              <Label htmlFor="budget_total">
                <Wallet className="mr-1 inline h-3.5 w-3.5" /> Total Budget (Rp)
              </Label>
              <Input id="budget_total" type="number" min={50000} step={50000} {...register('budget_total')} className="mt-1.5" />
              {errors.budget_total && <p className="mt-1 text-xs text-destructive">{errors.budget_total.message}</p>}
            </div>
          </div>

          <div>
            <Label>Minat Perjalanan</Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Pilih dari daftar, atau tambahkan minat lain sendiri kalau tidak ada yang cocok.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {combinedOptions.map((opt) => {
                const active = selectedInterests?.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleInterest(opt.value)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                      active
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-border bg-card text-muted-foreground hover:border-primary-300'
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
              {/* Tampilkan minat custom yang sudah ditambahkan tapi belum ada di daftar utama */}
              {(selectedInterests ?? [])
                .filter((v) => !combinedOptions.some((opt) => opt.value === v))
                .map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => toggleInterest(v)}
                    className="rounded-full border border-primary-600 bg-primary-600 px-3.5 py-1.5 text-sm font-medium text-white"
                  >
                    {v} ✕
                  </button>
                ))}
            </div>

            <div className="mt-3 flex gap-2">
              <Input
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomInterest();
                  }
                }}
                placeholder="Minat lain, mis. Diving, Surfing, Wisata Religi..."
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addCustomInterest}>
                Tambah
              </Button>
            </div>
            {errors.interests && <p className="mt-1 text-xs text-destructive">{errors.interests.message}</p>}
          </div>

          <div>
            <Label>Tempo Perjalanan</Label>
            <Controller
              control={control}
              name="travel_pace"
              render={({ field }) => (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(['santai', 'normal', 'padat'] as const).map((pace) => (
                    <button
                      key={pace}
                      type="button"
                      onClick={() => field.onChange(pace)}
                      className={cn(
                        'rounded-lg border py-2 text-sm font-medium capitalize transition-colors',
                        field.value === pace
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-border text-muted-foreground hover:border-primary-300'
                      )}
                    >
                      {pace}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          <div>
            <Label>
              <Car className="mr-1 inline h-3.5 w-3.5" /> Moda Transportasi
            </Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Menentukan estimasi waktu tempuh & gaya itinerary (mis. transportasi umum butuh buffer
              waktu transit, kendaraan sewa perlu waktu serah-terima).
            </p>
            <Controller
              control={control}
              name="transport_mode"
              render={({ field }) => (
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {TRANSPORT_MODE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={cn(
                        'rounded-lg border py-2 text-sm font-medium transition-colors',
                        field.value === opt.value
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-border text-muted-foreground hover:border-primary-300'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.transport_mode && <p className="mt-1 text-xs text-destructive">{errors.transport_mode.message}</p>}
          </div>

          <div>
            <Label htmlFor="notes">Catatan Tambahan (opsional)</Label>
            <Textarea id="notes" placeholder="mis. bawa anak kecil, hindari aktivitas ekstrem, dll." {...register('notes')} className="mt-1.5" rows={3} />
            {errors.notes && <p className="mt-1 text-xs text-destructive">{errors.notes.message}</p>}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error.message}
            </div>
          )}

          <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={isPending || !isAuthenticated}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> AI sedang menyusun itinerary...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate Itinerary dengan AI
              </>
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            Pengguna <Badge variant="secondary" className="mx-1">Demo</Badge> dibatasi 2x generate per hari.{' '}
            <a href="/pricing" className="font-medium text-primary-600 hover:underline">
              Upgrade ke Pro
            </a>{' '}
            untuk generate tanpa batas.
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
