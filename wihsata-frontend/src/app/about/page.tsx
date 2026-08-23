import type { Metadata } from 'next';
import { SectionHeading } from '@/components/shared/section-heading';

export const metadata: Metadata = { title: 'Tentang Kami' };

export default function AboutPage() {
  return (
    <div className="container max-w-3xl py-16">
      <SectionHeading
        eyebrow="Tentang Kami"
        title="Membantu traveler Indonesia merencanakan perjalanan lebih baik"
        description="Wihsata lahir dari keinginan membuat perencanaan wisata semudah mengobrol dengan teman yang tahu segalanya tentang destinasi Indonesia."
      />
      <div className="prose prose-neutral mt-8 max-w-none text-muted-foreground">
        <p>
          Kami menggabungkan data destinasi terverifikasi komunitas dengan teknologi AI untuk menghasilkan
          rekomendasi dan itinerary yang benar-benar sesuai kebutuhanmu — bukan sekadar daftar tempat wisata generik.
        </p>
        <p>
          Tim kami terdiri dari traveler, engineer, dan pegiat pariwisata lokal yang percaya bahwa setiap
          orang berhak mendapatkan pengalaman perjalanan terbaik tanpa ribet merencanakan dari nol.
        </p>
      </div>
    </div>
  );
}
