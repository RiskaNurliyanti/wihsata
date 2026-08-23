import { z } from 'zod';

export const destinationSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda strip'),
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  description: z.string().optional().or(z.literal('')),
  category_id: z.string().uuid().optional().or(z.literal('')),
  district_id: z.string().uuid().optional().or(z.literal('')),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  address: z.string().optional().or(z.literal('')),
  price_range: z.string().optional().or(z.literal('')),
  cover_image_url: z.string().url('URL gambar tidak valid').optional().or(z.literal('')),
  google_maps_url: z.string().url('URL Google Maps tidak valid').optional().or(z.literal('')),
  facilities_text: z.string().optional().or(z.literal('')),
  is_featured: z.boolean().default(false),
});

export type DestinationFormValues = z.infer<typeof destinationSchema>;
