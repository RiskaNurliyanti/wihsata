import { cn } from '@/lib/utils';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Bungkus elemen <table> agar bisa di-scroll horizontal di layar sempit (HP/tablet)
 * alih-alih memampatkan kolom sampai tidak terbaca. `min-w-[640px]` pada <table>
 * memastikan kolom tetap punya ruang cukup, dan overflow-x-auto memberi scrollbar
 * hanya saat dibutuhkan.
 */
export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <div className="min-w-[640px]">{children}</div>
    </div>
  );
}
