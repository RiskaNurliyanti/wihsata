import {
  ParkingCircle,
  Bath,
  Utensils,
  Landmark,
  Wifi,
  Tent,
  Camera,
  Waves,
  Home,
  LifeBuoy,
  ShoppingBag,
  Users,
  type LucideIcon,
} from 'lucide-react';

/**
 * Daftar preset fasilitas destinasi wisata + ikonnya masing-masing.
 * Dipakai di form admin (chip selector) dan halaman detail destinasi
 * (supaya ikon yang tampil sesuai fasilitasnya, bukan generik semua).
 */
export const FACILITY_PRESETS: { label: string; icon: LucideIcon }[] = [
  { label: 'Parkir', icon: ParkingCircle },
  { label: 'Toilet', icon: Bath },
  { label: 'Mushola', icon: Landmark },
  { label: 'Warung/Kantin', icon: Utensils },
  { label: 'Gazebo', icon: Home },
  { label: 'WiFi', icon: Wifi },
  { label: 'Camping Ground', icon: Tent },
  { label: 'Spot Foto', icon: Camera },
  { label: 'Kolam Renang', icon: Waves },
  { label: 'Penyewaan Alat', icon: ShoppingBag },
  { label: 'Pemandu Wisata', icon: Users },
  { label: 'Pelampung/Life Jacket', icon: LifeBuoy },
];

/** Cari ikon yang cocok untuk sebuah fasilitas, fallback ke ikon default kalau custom. */
export function getFacilityIcon(label: string): LucideIcon {
  return FACILITY_PRESETS.find((f) => f.label === label)?.icon ?? ParkingCircle;
}
