'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * Kotak pencarian generik untuk daftar admin (destinasi, trip, blog,
 * komunitas, pengguna). Filter dilakukan CLIENT-SIDE di masing-masing
 * komponen tabel — data admin selalu diambil penuh (per_page=100/200)
 * tanpa pagination sungguhan, jadi filter di client instan tanpa request
 * tambahan & tidak reload halaman.
 */
export function AdminSearchBox({
  value,
  onChange,
  placeholder = 'Cari...',
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn('relative max-w-sm', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-9" />
    </div>
  );
}
