import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Kebijakan Privasi' };

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-16">
      <h1 className="font-display text-3xl font-bold text-foreground">Kebijakan Privasi</h1>
      <div className="prose prose-neutral mt-6 max-w-none text-muted-foreground">
        <p>
          Kami menghargai privasi Anda. Data lokasi hanya digunakan untuk menampilkan destinasi terdekat dan
          tidak disimpan tanpa izin eksplisit.
        </p>
        <p>Data akun dikelola secara aman dengan enkripsi standar industri.</p>
        <p>Silakan hubungi kami di hello@wihsata.com untuk pertanyaan terkait data pribadi Anda.</p>
      </div>
    </div>
  );
}
