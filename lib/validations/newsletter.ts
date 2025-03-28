import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  preferences: z.object({
    categories: z.array(z.string()),
    frequency: z.enum(['daily', 'weekly', 'monthly']),
  }).optional(),
});
