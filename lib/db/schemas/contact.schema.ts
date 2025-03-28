import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  status: text('status').default('pending').notNull(),
  assignedTo: uuid('assigned_to'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
