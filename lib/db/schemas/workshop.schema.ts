import { pgTable, uuid, text, timestamp, integer, numeric, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user.schema';

export const workshops = pgTable('workshops', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  date: text('date').notNull(), // Support date ranges like "June 15-20, 2024"
  time: text('time').notNull(),
  location: text('location').notNull().default('Virtual'),
  capacity: integer('capacity').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(),
  image: text('image').notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  spotsLeft: integer('spots_left').notNull(),
  isRegistrationOpen: boolean('is_registration_open').default(true).notNull(),
  materials: jsonb('materials').default([]).notNull(),
  
  // Videos, documents, and links that TCamp shares with participants
  resources: jsonb('resources').default([]).notNull(),
  
  // Chat messages between TCamp and participants
  messages: jsonb('messages').default([]).notNull(),
  
  // Simple array of registrations
  registrations: jsonb('registrations').default([]).notNull(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const workshopsRelations = relations(workshops, ({ many }) => ({
  students: many(users),
}));
