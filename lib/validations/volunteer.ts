import { z } from 'zod';

export const volunteerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().length(2, 'State must be a 2-letter code'),
  interests: z.string().optional(),
});
