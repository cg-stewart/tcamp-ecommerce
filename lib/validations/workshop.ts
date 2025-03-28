import { z } from 'zod';

export const workshopSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.string().url('Invalid image URL').optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  price: z.number().min(0, 'Price must be a positive number'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  instructorId: z.string().uuid('Invalid instructor ID').optional(),
  materials: z.array(z.object({
    name: z.string(),
    required: z.boolean(),
    provided: z.boolean(),
  })).optional(),
  isFeatured: z.boolean().default(false),
});

export const workshopRegistrationSchema = z.object({
  workshopId: z.string().uuid('Invalid workshop ID'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  participants: z.number().min(1, 'Must have at least 1 participant').max(10, 'Maximum 10 participants'),
  specialRequirements: z.string().optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded', 'failed']).default('pending'),
});
