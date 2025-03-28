import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { workshops } from "@/lib/db/schemas/workshop.schema";
import { eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";

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

// Mock workshop messages for demonstration - in production, these would be stored in the database
const mockMessages = {
  "1": [
    {
      id: "m1",
      userId: "admin1",
      userName: "Admin",
      content: "Welcome to the Sewing Basics workshop! Looking forward to meeting everyone.",
      createdAt: new Date("2024-03-15T10:00:00Z"),
    },
    {
      id: "m2",
      userId: "user1",
      userName: "Jane Smith",
      content: "I'm excited to join! Should I bring my own sewing machine?",
      createdAt: new Date("2024-03-15T10:15:00Z"),
    },
    {
      id: "m3",
      userId: "admin1",
      userName: "Admin",
      content: "Great question, Jane! No need to bring your own machine, we'll provide everything needed.",
      createdAt: new Date("2024-03-15T10:20:00Z"),
    },
  ],
  "2": [
    {
      id: "m4",
      userId: "admin1",
      userName: "Admin",
      content: "Pattern Making Workshop starts next week! Please review the materials list I've shared.",
      createdAt: new Date("2024-03-10T09:00:00Z"),
    },
  ],
};

export async function GET(
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

    // Return mock messages for now - in production, fetch from database
    const messages = mockMessages[workshopId as keyof typeof mockMessages] || [];

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching workshop messages:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch workshop messages" },
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
    
    const workshopId = params.id;

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

    // Parse the request body
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { success: false, message: "Message content is required" },
        { status: 400 }
      );
    }

    // In a real application, you would save the message to your database
    // For this demo, we'll mock a successful message
    const newMessage = {
      id: `m${Date.now()}`,
      userId: "admin1",
      userName: "Admin",
      content,
      createdAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending workshop message:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send workshop message" },
      { status: 500 }
    );
  }
}
