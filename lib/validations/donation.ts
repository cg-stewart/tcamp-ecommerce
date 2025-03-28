import { z } from 'zod';

export const donationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'),
  message: z.string().optional(),
  isMonthly: z.boolean().default(false),
});
