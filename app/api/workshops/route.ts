import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { workshops } from '@/lib/db/schemas/workshop.schema';
import { desc, eq, and, SQL } from 'drizzle-orm';

// Public API endpoint for workshops - no authentication required
export async function GET(request: Request) {
  try {
    // Check if DB is initialized
    if (typeof db === 'undefined') {
      return NextResponse.json(
        { success: false, message: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    
    // Build conditions array for the query
    const conditions: SQL[] = [];
    
    if (featured === 'true') {
      conditions.push(eq(workshops.isFeatured, true));
    }
    
    if (category) {
      conditions.push(eq(workshops.category, category));
    }
    
    // Build and execute the query
    const baseQuery = db
      .select()
      .from(workshops)
      .orderBy(desc(workshops.createdAt));

    // Apply conditions if any
    const queryWithConditions = conditions.length > 0
      ? baseQuery.where(and(...conditions))
      : baseQuery;

    // Apply limit if specified
    const finalQuery = limit
      ? queryWithConditions.limit(parseInt(limit))
      : queryWithConditions;
    
    // Execute the query
    const results = await finalQuery;
    
    return NextResponse.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching workshops:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch workshops' },
      { status: 500 }
    );
  }
}
