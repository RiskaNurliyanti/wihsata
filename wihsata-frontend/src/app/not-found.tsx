import Link from 'next/link';
import { Compass, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="relative">
        <span className="font-display text-[120px] font-black leading-none text-primary-100 sm:text-[160px]">
          404
        </span>
        <Compass className="absolute inset-0 m-auto h-16 w-16 animate-pulse text-primary-500" />
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Destinasi Tidak Ditemukan</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Sepertinya kamu tersesat. Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button variant="gradient">
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>
        <Link href="/explore">
          <Button variant="outline">
            <Search className="h-4 w-4" />
            Jelajahi Destinasi
          </Button>
        </Link>
      </div>
    </div>
  );
}
