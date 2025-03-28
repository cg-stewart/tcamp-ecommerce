import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const volunteers = pgTable('volunteers', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  interests: text('interests'),
  status: text('status').default('new').notNull(),
  clerkId: text('clerk_id'), // Associated Clerk user ID (optional)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
