import { z } from 'zod';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const aiPlannerSchema = z
  .object({
    origin_location: z
      .string()
      .min(2, 'Kota/titik keberangkatan wajib diisi')
      .max(100, 'Nama kota asal terlalu panjang'),
    destination_area: z
      .string()
      .min(3, 'Nama daerah tujuan minimal 3 karakter')
      .max(100, 'Nama daerah terlalu panjang'),
    start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
    end_date: z.string().min(1, 'Tanggal selesai wajib diisi'),
    departure_time: z
      .string()
      .min(1, 'Jam keberangkatan wajib diisi')
      .regex(TIME_REGEX, 'Format jam tidak valid (HH:MM)'),
    return_time: z
      .string()
      .min(1, 'Jam kepulangan wajib diisi')
      .regex(TIME_REGEX, 'Format jam tidak valid (HH:MM)'),
    travelers_count: z.coerce
      .number()
      .int('Harus bilangan bulat')
      .min(1, 'Minimal 1 orang')
      .max(30, 'Maksimal 30 orang'),
    budget_total: z.coerce
      .number()
      .min(50_000, 'Budget minimal Rp 50.000')
      .max(500_000_000, 'Budget maksimal terlalu besar'),
    interests: z
      .array(z.string())
      .min(1, 'Pilih minimal 1 minat perjalanan'),
    travel_pace: z.enum(['santai', 'normal', 'padat']),
    transport_mode: z.enum(['private_vehicle', 'rental_vehicle', 'public_transport'], {
      required_error: 'Pilih moda transportasi terlebih dahulu',
    }),
    notes: z.string().max(500, 'Catatan maksimal 500 karakter').optional(),
  })
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    message: 'Tanggal selesai harus setelah tanggal mulai',
    path: ['end_date'],
  });

export type AiPlannerFormValues = z.infer<typeof aiPlannerSchema>;

export const INTEREST_OPTIONS = [
  { value: 'alam', label: 'Alam & Pemandangan' },
  { value: 'kuliner', label: 'Kuliner' },
  { value: 'budaya', label: 'Budaya & Sejarah' },
  { value: 'petualangan', label: 'Petualangan' },
  { value: 'santai', label: 'Santai & Relaksasi' },
  { value: 'fotografi', label: 'Spot Foto' },
  { value: 'keluarga', label: 'Ramah Keluarga' },
  { value: 'belanja', label: 'Belanja & Oleh-oleh' },
] as const;

export const TRANSPORT_MODE_OPTIONS = [
  { value: 'private_vehicle', label: 'Kendaraan Pribadi' },
  { value: 'rental_vehicle', label: 'Kendaraan Sewa' },
  { value: 'public_transport', label: 'Transportasi Umum' },
] as const;
