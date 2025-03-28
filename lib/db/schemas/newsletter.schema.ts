import { pgTable, uuid, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const newsletters = pgTable('newsletters', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  isSubscribed: boolean('is_subscribed').default(true).notNull(),
  preferences: jsonb('preferences').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
