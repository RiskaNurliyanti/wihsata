import { z } from 'zod';

export const adminTripSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  status: z.enum(['draft', 'upcoming', 'completed', 'archived']),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
  budget_estimate: z.coerce.number().min(0).optional(),
  is_public: z.boolean().default(false),
});

export type AdminTripFormValues = z.infer<typeof adminTripSchema>;
