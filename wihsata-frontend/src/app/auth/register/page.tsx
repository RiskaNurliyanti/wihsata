import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { RegisterForm } from '@/components/shared/register-form';

export const metadata: Metadata = { title: 'Daftar' };

export default function RegisterPage() {
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
          <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Buat Akun Baru</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gratis untuk memulai. Upgrade kapan saja.</p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="font-medium text-primary-600 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
