import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, AlertTriangle } from 'lucide-react';
import { ResetPasswordForm } from '@/components/shared/reset-password-form';

export const metadata: Metadata = { title: 'Reset Password' };

interface ResetPasswordPageProps {
  searchParams: { token?: string; email?: string };
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token, email } = searchParams;

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-xl font-bold text-primary-700">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 text-white">
              <Compass className="h-5 w-5" />
            </div>
            Wihsata
          </Link>
          <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Buat Password Baru</h1>
          <p className="mt-1 text-sm text-muted-foreground">Masukkan password baru untuk akunmu.</p>
        </div>

        {!token || !email ? (
          <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Link reset password tidak valid atau sudah kedaluwarsa. Silakan minta link baru lewat halaman{' '}
              <Link href="/auth/forgot-password" className="font-medium underline">
                Lupa Password
              </Link>
              .
            </p>
          </div>
        ) : (
          <ResetPasswordForm token={token} email={email} />
        )}
      </div>
    </div>
  );
}
