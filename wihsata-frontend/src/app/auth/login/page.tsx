import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { LoginForm } from '@/components/shared/login-form';

export const metadata: Metadata = { title: 'Masuk' };

export default function LoginPage({ searchParams }: { searchParams: { redirect?: string; registered?: string; reset?: string } }) {
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
          <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Selamat Datang Kembali</h1>
          <p className="mt-1 text-sm text-muted-foreground">Masuk untuk melanjutkan perjalananmu.</p>
        </div>

        {searchParams.registered && (
          <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-2.5 text-center text-sm text-emerald-700">
            Registrasi berhasil! Silakan cek email untuk verifikasi, lalu masuk di bawah.
          </p>
        )}

        {searchParams.reset && (
          <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-2.5 text-center text-sm text-emerald-700">
            Password berhasil diubah! Silakan masuk dengan password barumu.
          </p>
        )}

        <LoginForm redirectTo={searchParams.redirect} />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{' '}
          <Link href="/auth/register" className="font-medium text-primary-600 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}