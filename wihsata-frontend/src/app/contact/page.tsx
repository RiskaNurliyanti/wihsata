import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';

export const metadata: Metadata = { title: 'Kontak' };

export default function ContactPage() {
  return (
    <div className="container max-w-3xl py-16">
      <SectionHeading eyebrow="Kontak" title="Ada pertanyaan? Hubungi kami" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-border p-5 text-center">
          <Mail className="mx-auto h-6 w-6 text-primary-600" />
          <p className="mt-3 text-sm font-medium text-foreground">Email</p>
          <p className="text-sm text-muted-foreground">hello@wihsata.com</p>
        </div>
        <div className="rounded-xl border border-border p-5 text-center">
          <Phone className="mx-auto h-6 w-6 text-primary-600" />
          <p className="mt-3 text-sm font-medium text-foreground">Telepon</p>
          <p className="text-sm text-muted-foreground">+62 812-0000-0000</p>
        </div>
        <div className="rounded-xl border border-border p-5 text-center">
          <MapPin className="mx-auto h-6 w-6 text-primary-600" />
          <p className="mt-3 text-sm font-medium text-foreground">Lokasi</p>
          <p className="text-sm text-muted-foreground">Samarinda, Indonesia</p>
        </div>
      </div>
    </div>
  );
}
