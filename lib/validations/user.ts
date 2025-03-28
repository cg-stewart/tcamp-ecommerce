import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  profileImage: z.string().url('Invalid image URL').optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().length(2, 'State must be a 2-letter code').optional(),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code').optional(),
  }).optional(),
});

export const userSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean(),
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'contacts']),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
  }),
  communication: z.object({
    emailFrequency: z.enum(['daily', 'weekly', 'monthly', 'never']),
    newsletterSubscription: z.boolean(),
  }),
});
