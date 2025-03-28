import { NextResponse } from 'next/server';
import { db, type DrizzleDB } from '@/lib/db/drizzle';
import { workshops } from '@/lib/db/schemas/workshop.schema';
import { desc, eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

// Helper function to check admin authorization
async function checkAdminAuth() {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    return { authorized: false, error: 'Unauthorized: Not authenticated' };
  }
  
  // In production, check if the user has admin role using session claims
  // This assumes you've set up custom claims with an 'admin' role
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
    
    // Since this is an admin route, we should check authentication
    // The middleware will already protect this route, but we'll add an extra check here
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: 401 }
      );
    }
    
    const allWorkshops = await db
      .select()
      .from(workshops)
      .orderBy(desc(workshops.createdAt));

    return NextResponse.json({
      success: true,
      data: allWorkshops,
    });
  } catch (error) {
    console.error('Error fetching workshops:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch workshops' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check if DB is initialized
    if (typeof db === 'undefined') {
      return NextResponse.json(
        { success: false, message: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    // Admin authorization check
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'capacity'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Add timestamps and default values
    const newWorkshop = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: authCheck.userId,
      spotsLeft: body.capacity,
      isRegistrationOpen: body.isRegistrationOpen ?? true,
      messages: [],
      materials: [],
      resources: [],
      registrations: 0
    };
    
    // Insert into database
    const result = await db.insert(workshops).values(newWorkshop).returning();
    
    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Workshop created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating workshop:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create workshop' },
      { status: 500 }
    );
  }
}
