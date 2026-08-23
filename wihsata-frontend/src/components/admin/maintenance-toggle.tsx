'use client';

import { useState, useTransition } from 'react';
import { AlertTriangle, Check, Loader2, Power } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { updateMaintenanceAction } from '@/lib/actions/maintenance.actions';

interface MaintenanceToggleProps {
  initialEnabled: boolean;
  initialMessage: string;
}

export function MaintenanceToggle({ initialEnabled, initialMessage }: MaintenanceToggleProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [message, setMessage] = useState(initialMessage);
  const [error, setError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggle(next: boolean) {
    setError(null);
    setSavedNote(null);

    startTransition(async () => {
      const result = await updateMaintenanceAction(next, message);
      if (result.error) {
        setError(result.error);
        return;
      }
      setEnabled(next);
      setSavedNote(next ? 'Maintenance diaktifkan.' : 'Maintenance dinonaktifkan.');
    });
  }

  function handleSaveMessage() {
    setError(null);
    setSavedNote(null);

    startTransition(async () => {
      const result = await updateMaintenanceAction(enabled, message);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSavedNote('Pesan maintenance disimpan.');
    });
  }

  return (
    <Card>
      <CardContent className="space-y-5 pt-6">
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              Status Maintenance
              {enabled ? (
                <Badge variant="warning">Aktif</Badge>
              ) : (
                <Badge variant="secondary">Nonaktif</Badge>
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {enabled
                ? 'Pengguna biasa melihat halaman pemberitahuan maintenance di semua halaman.'
                : 'Website berjalan normal untuk semua pengguna.'}
            </p>
          </div>
          <Button
            type="button"
            variant={enabled ? 'outline' : 'gradient'}
            onClick={() => handleToggle(!enabled)}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
            {enabled ? 'Matikan Maintenance' : 'Aktifkan Maintenance'}
          </Button>
        </div>

        <div>
          <label htmlFor="maintenance_message" className="text-sm font-medium text-foreground">
            Pesan Maintenance
          </label>
          <Textarea
            id="maintenance_message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="mt-1.5"
            placeholder={'Website sedang dalam pemeliharaan\n\nKami sedang melakukan pembaruan dan perbaikan sistem. Silakan kembali beberapa saat lagi.'}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Baris pertama ditampilkan sebagai judul, baris berikutnya sebagai deskripsi.
          </p>
          <Button type="button" size="sm" className="mt-2" onClick={handleSaveMessage} disabled={isPending}>
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Simpan Pesan
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        {savedNote && !error && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/50 dark:text-green-400">
            <Check className="h-4 w-4 shrink-0" />
            {savedNote}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
