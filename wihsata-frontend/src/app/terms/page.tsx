import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Ketentuan Layanan' };

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-16">
      <h1 className="font-display text-3xl font-bold text-foreground">Ketentuan Layanan</h1>
      <div className="prose prose-neutral mt-6 max-w-none text-muted-foreground">
        <p>
          Dengan menggunakan Wihsata, Anda setuju untuk menggunakan layanan ini secara wajar dan tidak
          menyalahgunakan fitur AI Planner untuk tujuan di luar perencanaan perjalanan pribadi.
        </p>
        <p>Paket Pro dapat dibatalkan kapan saja melalui halaman pengaturan akun.</p>
      </div>
    </div>
  );
}
