import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { workshops } from "@/lib/db/schemas/workshop.schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

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

// Mock workshop resources for demonstration - in production, these would be stored in the database
const mockResources = {
  "1": [
    {
      id: "r1",
      title: "Workshop Materials List",
      description: "Complete list of materials needed for the workshop",
      url: "/workshop-files/materials.pdf",
      type: "document",
      createdAt: new Date("2024-03-15T10:00:00Z"),
    },
    {
      id: "r2",
      title: "Intro Tutorial",
      description: "Video introduction to the workshop concepts",
      url: "/workshop-files/intro.mp4",
      type: "video",
      createdAt: new Date("2024-03-16T14:30:00Z"),
    },
  ],
  "2": [
    {
      id: "r3",
      title: "Pattern Template",
      description: "Base pattern template for the workshop",
      url: "/workshop-files/pattern.pdf",
      type: "document",
      createdAt: new Date("2024-03-10T09:15:00Z"),
    },
  ],
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authorization
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: 401 }
      );
    }
    
    // Check if user is an admin (you can implement proper role checks)
    // For now, let's assume all authenticated users can access this

    const workshopId = params.id;
    
    // Check if DB is initialized
    if (typeof db === 'undefined') {
      return NextResponse.json(
        { success: false, message: 'Database connection not available' },
        { status: 503 }
      );
    }

    // Get the workshop to verify it exists
    const workshop = await db
      .select()
      .from(workshops)
      .where(eq(workshops.id, workshopId))
      .limit(1);

    if (!workshop || workshop.length === 0) {
      return NextResponse.json(
        { success: false, message: "Workshop not found" },
        { status: 404 }
      );
    }

    // Return mock resources for now - in production, fetch from database
    const resources = mockResources[workshopId as keyof typeof mockResources] || [];

    return NextResponse.json({
      success: true,
      data: resources,
    });
  } catch (error) {
    console.error("Error fetching workshop resources:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch workshop resources" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    // Check if user is an admin (you can implement proper role checks)
    // For now, let's assume all authenticated users can access this

    const workshopId = params.id;
    
    // Check if DB is initialized
    if (typeof db === 'undefined') {
      return NextResponse.json(
        { success: false, message: 'Database connection not available' },
        { status: 503 }
      );
    }

    // Get the workshop to verify it exists
    const workshop = await db
      .select()
      .from(workshops)
      .where(eq(workshops.id, workshopId))
      .limit(1);

    if (!workshop || workshop.length === 0) {
      return NextResponse.json(
        { success: false, message: "Workshop not found" },
        { status: 404 }
      );
    }

    // In a real application, you would:
    // 1. Parse the multipart form data
    // 2. Upload the file to a storage service (e.g., S3, Cloudinary)
    // 3. Save the metadata in your database

    // For this demo, we'll mock a successful upload
    return NextResponse.json({
      success: true,
      message: "Resource uploaded successfully",
      data: {
        id: `r${Date.now()}`,
        title: "New Resource",
        description: "Newly uploaded resource",
        url: "/workshop-files/new-resource.pdf",
        type: "document",
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error uploading workshop resource:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload workshop resource" },
      { status: 500 }
    );
  }
}
