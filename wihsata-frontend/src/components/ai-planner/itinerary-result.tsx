'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Clock, Wallet, Lightbulb, Save, Download, RotateCcw, CloudSun, Loader2, MapPin, AlertCircle, Route, Car, Undo2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { apiFetch, ApiError, getClientToken } from '@/lib/api/client';
import { useDownloadPdf } from '@/hooks/use-download-pdf';
import { formatRupiah } from '@/lib/utils';
import type { AiPlannerOutput } from '@/types/database.types';

interface ItineraryResultProps {
  result: AiPlannerOutput;
  onReset: () => void;
}

const TRANSPORT_MODE_LABEL: Record<string, string> = {
  private_vehicle: 'Kendaraan Pribadi',
  rental_vehicle: 'Kendaraan Sewa',
  public_transport: 'Transportasi Umum',
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} menit`;
  return m === 0 ? `${h} jam` : `${h} jam ${m} menit`;
}

export function ItineraryResult({ result, onReset }: ItineraryResultProps) {
  const router = useRouter();
  const [isSaving, startSaving] = useTransition();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { download, isDownloading, error: pdfError } = useDownloadPdf();

  function handleSaveTrip() {
    startSaving(async () => {
      if (!getClientToken()) {
        router.push('/auth/login');
        return;
      }

      try {
        await apiFetch('/trips', {
          method: 'POST',
          json: {
            title: (result.summary ?? 'Itinerary Wihsata').slice(0, 80),
            budget_estimate: result.total_estimated_cost ?? 0,
            itinerary: result.days ?? [],
            preferences: result.transport_mode ? { transport_mode: result.transport_mode } : null,
          },
        });
        setSaved(true);
      } catch (error) {
        setSaveError(error instanceof ApiError ? error.message : 'Gagal menyimpan trip.');
      }
    });
  }

  function handleDownloadPdf() {
    download({ title: (result.summary ?? 'Itinerary Wihsata').slice(0, 80) || 'Itinerary Wihsata', itinerary: result });
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-primary-100">Ringkasan Trip</p>
          <p className="mt-1 text-lg font-semibold">{result.summary ?? 'Itinerary perjalanan Anda.'}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm">
              <Wallet className="h-4 w-4" />
              Total estimasi: <strong>{formatRupiah(result.total_estimated_cost ?? 0)}</strong>
            </div>
            {result.weather_note && (
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm">
                <CloudSun className="h-4 w-4" />
                {result.weather_note}
              </div>
            )}
            {result.transport_mode && (
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm">
                <Car className="h-4 w-4" />
                {TRANSPORT_MODE_LABEL[result.transport_mode] ?? result.transport_mode}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {(result.days ?? []).map((day) => (
        <Card key={day.day}>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Hari {day.day} {day.date && <span className="text-sm font-normal text-muted-foreground">— {day.date}</span>}
              </h3>
              <div className="flex items-center gap-2">
                {typeof day.total_travel_time_minutes === 'number' && day.total_travel_time_minutes > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <Route className="h-3 w-3" /> {formatDuration(day.total_travel_time_minutes)} perjalanan
                  </Badge>
                )}
                <Badge variant="secondary">{formatRupiah(day.subtotal)}</Badge>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {day.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex w-16 shrink-0 items-center gap-1 pt-0.5 text-sm font-medium text-primary-700 dark:text-primary-400">
                    <Clock className="h-3.5 w-3.5" />
                    {item.time}
                  </div>
                  <div className="flex flex-1 gap-3 border-l-2 border-primary-100 pb-4 pl-4 dark:border-primary-900">
                    {item.image_url && (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg sm:h-14 sm:w-14">
                        <Image src={item.image_url} alt={item.destination_name} fill quality={90} className="object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1 font-medium text-foreground">
                        {item.destination_id && <MapPin className="h-3.5 w-3.5 shrink-0 text-primary-600 dark:text-primary-400" />}
                        {item.destination_name}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{item.activity}</p>
                      {item.reason && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          <Lightbulb className="mr-1 inline h-3 w-3 text-amber-500" />
                          {item.reason}
                        </p>
                      )}
                      {typeof item.travel_time_minutes === 'number' && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Route className="h-3 w-3" />
                          ±{formatDuration(item.travel_time_minutes)}
                          {typeof item.distance_km === 'number' && ` (±${item.distance_km}km)`}
                          {' '}dari lokasi sebelumnya
                        </p>
                      )}
                      {item.notes && <p className="mt-1 text-xs italic text-muted-foreground">{item.notes}</p>}
                      <p className="mt-1 text-sm font-medium text-primary-700 dark:text-primary-400">{formatRupiah(item.estimated_cost)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {result.return_trip_estimate && (
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Undo2 className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Estimasi Perjalanan Kembali</p>
              <p className="text-muted-foreground">
                ±{formatDuration(result.return_trip_estimate.travel_time_minutes)} (±{result.return_trip_estimate.distance_km}km)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {(result.recommendations ?? []).length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <Lightbulb className="h-5 w-5 text-amber-500" /> Rekomendasi Tambahan
            </h3>
            <Separator className="my-3" />
            <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              {(result.recommendations ?? []).map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {saveError && <p className="text-center text-sm text-destructive">{saveError}</p>}
      {pdfError && (
        <p className="flex items-center justify-center gap-1.5 text-center text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {pdfError}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="gradient" onClick={handleSaveTrip} disabled={isSaving || saved}>
          <Save className="h-4 w-4" />
          {saved ? 'Tersimpan ke My Trip' : isSaving ? 'Menyimpan...' : 'Simpan ke My Trip'}
        </Button>
        <Button variant="outline" onClick={handleDownloadPdf} disabled={isDownloading}>
          {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {isDownloading ? 'Membuat PDF...' : 'Download PDF'}
          <Badge variant="pro" className="ml-1">Pro</Badge>
        </Button>
        <Button variant="ghost" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Buat Itinerary Baru
        </Button>
      </div>
    </div>
  );
}
