import { pgTable, uuid, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

export const customDesigns = pgTable('custom_designs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  requirements: jsonb('requirements').notNull(),
  budget: integer('budget'),
  timeline: text('timeline'),
  status: text('status').default('pending').notNull(),
  attachments: jsonb('attachments').default([]).notNull(),
  feedback: jsonb('feedback').default([]).notNull(),
  images: jsonb('images').default([]).notNull(),
  measurements: jsonb('measurements').default({}).notNull(),
  fabricPreferences: jsonb('fabric_preferences').default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
