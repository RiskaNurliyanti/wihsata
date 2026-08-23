import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Gabungkan className Tailwind dengan aman (menghindari konflik utility). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format angka menjadi Rupiah, mis. 150000 -> "Rp 150.000" */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format tanggal ke Bahasa Indonesia, mis. "18 Juli 2026" */
export function formatDateID(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Normalisasi nilai tanggal apa pun (format polos "YYYY-MM-DD" atau ISO
 * datetime penuh) menjadi format yang valid untuk <input type="date">.
 */
export function toDateInputValue(date: string | null | undefined): string {
  if (!date) return '';
  return date.slice(0, 10);
}

/** Jumlah hari inklusif antara dua tanggal "YYYY-MM-DD" (mis. 10 s/d 12 = 3 hari). */
export function daysBetweenInclusive(startDate: string, endDate: string): number {
  const start = new Date(`${startDate.slice(0, 10)}T00:00:00`);
  const end = new Date(`${endDate.slice(0, 10)}T00:00:00`);
  const diffMs = end.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

/** Format jarak dalam km menjadi label ramah-baca */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/** Buat slug URL-safe dari string, mis. "Air Terjun Tanah Merah" -> "air-terjun-tanah-merah" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Truncate teks dengan ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/** Debounce sederhana untuk fungsi non-hook (dipakai di luar komponen React) */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Hitung estimasi durasi baca artikel (menit) */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
