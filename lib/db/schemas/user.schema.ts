import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workshops } from './workshop.schema';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  clerkId: text('clerk_id').unique(),
  image: text('image'),
  role: text('role').default('user').notNull(),
  settings: jsonb('settings').default({
    notifications: {
      email: true,
      sms: false,
      marketing: true
    },
    theme: 'light',
    language: 'en',
    measurements: {},
    shippingAddresses: [],
    billingAddresses: [],
  }).notNull(),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  workshops: many(workshops),
}));
