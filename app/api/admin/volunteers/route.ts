import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { volunteers } from '@/lib/db/schemas/volunteer.schema';
import { desc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

// Helper function to check admin authorization
async function checkAdminAuth() {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    return { authorized: false, error: 'Unauthorized: Not authenticated' };
  }
  
  // In production, check if the user has admin role using session claims
  const metadata = sessionClaims?.metadata as { role?: string } || {};
  const isAdmin = metadata.role === 'admin';
  
  // For development, you can override this check
  // const isAdmin = true;
  
  if (!isAdmin) {
    return { authorized: false, error: 'Unauthorized: Not an admin' };
  }
  
  return { authorized: true, userId };
}

export async function GET() {
  try {
    // Check if DB is initialized
    if (typeof db === 'undefined') {
      return NextResponse.json(
        { success: false, message: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    // Verify admin authorization
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: 401 }
      );
    }
    
    const allVolunteers = await db
      .select()
      .from(volunteers)
      .orderBy(desc(volunteers.createdAt));

    return NextResponse.json({
      success: true,
      data: allVolunteers,
    });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch volunteers' },
      { status: 500 }
    );
  }
}
