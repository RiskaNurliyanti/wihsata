'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

/**
 * Providers global aplikasi. QueryClient dibuat via useState agar tidak
 * dibuat ulang setiap render, tapi tetap unik per-session di client
 * (menghindari state bocor antar user saat SSR).
 *
 * ThemeProvider (next-themes) menangani dark/light mode: menyimpan preferensi
 * di localStorage, menambahkan class `dark` ke <html>, dan menghormati
 * preferensi sistem operasi pengguna secara default.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
