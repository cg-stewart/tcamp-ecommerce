import { z } from 'zod';

export const customDesignSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.object({
    style: z.string().min(2, 'Style must be at least 2 characters'),
    dimensions: z.string().optional(),
    colors: z.array(z.string()).min(1, 'At least one color must be specified'),
    additionalNotes: z.string().optional(),
  }),
  budget: z.number().min(0, 'Budget must be a positive number').optional(),
  timeline: z.string().optional(),
  attachments: z.array(z.object({
    url: z.string().url('Invalid attachment URL'),
    type: z.string(),
    name: z.string(),
  })).optional(),
});
