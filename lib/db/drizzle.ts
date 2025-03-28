import { drizzle } from 'drizzle-orm/postgres-js';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import * as schema from './schemas/index';

// Define the database type
export type DrizzleDB = PostgresJsDatabase<typeof schema>;

// Database connection with Drizzle
let db: DrizzleDB | undefined;
try {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn('DATABASE_URL is not set. Database operations will fail.');
  } else {
    const client = postgres(dbUrl);
    db = drizzle(client, { schema });
  }
} catch (error) {
  console.error('Failed to initialize database connection:', error);
}

export { db };

// Supabase client for auth and storage
let supabase;
try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials are not properly set. Auth and storage operations will fail.');
  } else {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

export { supabase };
