'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Kirim ke layanan monitoring (Sentry, LogRocket, dll) di sini.
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Terjadi Kesalahan</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Maaf, sistem mengalami gangguan tak terduga. Tim kami sudah diberi tahu. Silakan coba lagi.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset} variant="gradient">
          <RotateCw className="h-4 w-4" />
          Coba Lagi
        </Button>
        <Link href="/">
          <Button variant="outline">
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
      {error.digest && <p className="mt-4 text-xs text-muted-foreground">Error ID: {error.digest}</p>}
    </div>
  );
}
