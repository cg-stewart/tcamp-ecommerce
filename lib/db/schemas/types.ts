import { users } from './user.schema';
import { workshops } from './workshop.schema';
import { customDesigns } from './custom-design.schema';

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Workshop = typeof workshops.$inferSelect;
export type NewWorkshop = typeof workshops.$inferInsert;

export type CustomDesign = typeof customDesigns.$inferSelect;
export type NewCustomDesign = typeof customDesigns.$inferInsert;

export type WorkshopRegistration = {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  participants: number;
  specialRequirements?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  registeredAt: Date;
  updatedAt?: Date;
};

// Simple registration list - no need for complex embedding
export type WorkshopRegistrations = WorkshopRegistration[];

// Message in workshop chat
export type WorkshopMessage = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
};

// Workshop resource (file or video)
export type WorkshopResource = {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: 'document' | 'video' | 'link';
  createdAt: Date;
};
