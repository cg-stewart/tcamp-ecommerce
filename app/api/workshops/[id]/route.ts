import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { workshops } from '@/lib/db/schemas/workshop.schema';
import { eq } from 'drizzle-orm';

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
    
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Workshop ID is required' },
        { status: 400 }
      );
    }
    
    const [workshop] = await db
      .select()
      .from(workshops)
      .where(eq(workshops.id, id));
    
    if (!workshop) {
      return NextResponse.json(
        { success: false, message: 'Workshop not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: workshop
    });
  } catch (error) {
    console.error('Error fetching workshop:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch workshop' },
      { status: 500 }
    );
  }
}
