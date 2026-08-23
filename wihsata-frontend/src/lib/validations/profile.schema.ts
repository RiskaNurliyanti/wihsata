import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  username: z
    .string()
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .regex(/^[a-z0-9_]+$/, 'Username hanya boleh huruf kecil, angka, dan underscore')
    .optional()
    .or(z.literal('')),
  bio: z.string().max(300, 'Bio maksimal 300 karakter').optional().or(z.literal('')),
  home_city: z.string().max(100).optional().or(z.literal('')),
  avatar_url: z.string().url('URL avatar tidak valid').optional().or(z.literal('')),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
