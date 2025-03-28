"use server";

import { db } from "@/lib/db/drizzle";
import { workshops } from "@/lib/db/schemas/workshop.schema";
import { WorkshopRegistration } from "@/lib/db/schemas/types";
import { workshopSchema, workshopRegistrationSchema } from "@/lib/validations";
import { eq, desc, and } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

/**
 * Helper function to check database connection
 * @returns The database instance if it exists
 * @throws Error if database connection is not available
 */
function getDB() {
  if (typeof db === 'undefined') {
    throw new Error('Database connection not available');
  }
  return db;
}

/**
 * Get all workshops - public action
 */
export async function getAllWorkshops() {
  try {
    const allWorkshops = await getDB()
      .select()
      .from(workshops)
      .orderBy(desc(workshops.createdAt));
    return { success: true, data: allWorkshops };
  } catch (error) {
    return { success: false, message: "Failed to fetch workshops." };
  }
}

/**
 * Get featured workshops - public action
 */
export async function getFeaturedWorkshops() {
  try {
    const featuredWorkshops = await getDB()
      .select()
      .from(workshops)
      .where(eq(workshops.isFeatured, true))
      .orderBy(desc(workshops.createdAt));

    return { success: true, data: featuredWorkshops };
  } catch (error) {
    return { success: false, message: "Failed to fetch featured workshops." };
  }
}

/**
 * Get workshop by ID - public action
 */
export async function getWorkshopById(id: string) {
  try {

    
    const [workshop] = await getDB()
      .select()
      .from(workshops)
      .where(eq(workshops.id, id));

    if (!workshop) {
      return { success: false, message: "Workshop not found." };
    }

    return { success: true, data: workshop };
  } catch (error) {
    return { success: false, message: "Failed to fetch workshop details." };
  }
}

/**
 * Register for a workshop - authenticated action
 */
export async function registerForWorkshop(prevState: any, formData: FormData) {
  try {
    const workshopId = formData.get("workshopId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const participants =
      Number.parseInt(formData.get("participants") as string) || 1;
    const specialRequirements = formData.get("specialRequirements") as string;

    const validatedFields = workshopRegistrationSchema.safeParse({
      workshopId,
      name,
      email,
      phone,
      participants,
      specialRequirements,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: validatedFields.error.errors[0]?.message || "Invalid input",
      };
    }

    // Check authentication with Clerk
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Not authenticated" };
    }
    
    // Get user details
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }
    


    const [workshop] = await getDB()
      .select()
      .from(workshops)
      .where(eq(workshops.id, workshopId));

    if (!workshop) {
      return { success: false, message: "Workshop not found." };
    }

    // Check capacity using the simplified registration model
    const currentRegistrations = (workshop.registrations as WorkshopRegistration[] || []);
    const currentRegCount = currentRegistrations.length;
    const requestedSpots = participants;
    if (currentRegCount + requestedSpots > workshop.capacity) {
      return {
        success: false,
        message: "Not enough spots available for this workshop.",
      };
    }

    // Register with the simplified registration model
    const result = await addRegistration(workshopId, userId, {
      name,
      email,
      phone,
      participants,
      specialRequirements,
      paymentStatus: "pending"
    });

    await getDB()
      .update(workshops)
      .set({
        spotsLeft: workshop.capacity - (currentRegCount + participants),
        updatedAt: new Date(),
      })
      .where(eq(workshops.id, workshopId));

    return {
      success: true,
      message: "Registration successful!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to register for the workshop.",
    };
  }
}

/**
 * Get workshops for the current authenticated user
 */
export async function getUserWorkshopsForCurrentUser() {
  try {
    // Check authentication with Clerk
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Not authenticated" };
    }

    // Get user's registered workshops using the function we defined below
    const userWorkshops = await getUserWorkshops(userId);

    return {
      success: true,
      data: userWorkshops,
    };
  } catch (error) {
    return { success: false, message: "Failed to fetch your workshops." };
  }
}

/**
 * Create a new workshop - admin only action
 */
export async function createWorkshop(prevState: any, formData: FormData) {
  try {
    // Check admin authorization
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    // Check admin role
    const metadata = sessionClaims?.metadata as { role?: string } || {};
    const isAdmin = metadata.role === 'admin';
    if (!isAdmin) {
      return {
        success: false,
        message: "Unauthorized: Admin access required",
      };
    }
    


    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const location = formData.get("location") as string;
    const capacity = Number.parseInt(formData.get("capacity") as string);
    const price = Number.parseInt(formData.get("price") as string);
    const category = formData.get("category") as string;
    const image = formData.get("image") as string;
    const instructorId = formData.get("instructorId") as string;
    const materials = JSON.parse((formData.get("materials") as string) || "[]");
    const isFeatured = formData.get("featured") === "on";

    const validatedFields = workshopSchema.safeParse({
      title,
      description,
      date,
      time,
      location,
      capacity,
      price,
      category,
      image,
      instructorId,
      materials,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: validatedFields.error.errors[0]?.message || "Invalid input",
      };
    }

    // Format the date string correctly
    const newWorkshop = await getDB().insert(workshops).values({
      title,
      description,
      date,
      time,
      location,
      capacity: Number(capacity),
      price: String(price),
      category,
      image: image || `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(title)}`,
      spotsLeft: Number(capacity),
      isRegistrationOpen: true,
      resources: [],
      messages: [],
      registrations: [],
      isFeatured: isFeatured || false,
      materials: materials || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return {
      success: true,
      message: "Workshop created successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create workshop.",
    };
  }
}

/**
 * Update an existing workshop - admin only action
 */
export async function updateWorkshop(id: string, formData: FormData) {
  try {
    const db = getDB();
    // Check admin authorization
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    // Check admin role
    const metadata = sessionClaims?.metadata as { role?: string } || {};
    const isAdmin = metadata.role === 'admin';
    if (!isAdmin) {
      return {
        success: false,
        message: "Unauthorized: Admin access required",
      };
    }
    


    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const location = formData.get("location") as string;
    const capacity = Number.parseInt(formData.get("capacity") as string);
    const price = Number.parseInt(formData.get("price") as string);
    const category = formData.get("category") as string;
    const image = formData.get("image") as string;
    const instructorId = formData.get("instructorId") as string;
    const materials = JSON.parse((formData.get("materials") as string) || "[]");
    const isFeatured = formData.get("featured") === "on";

    const validatedFields = workshopSchema.safeParse({
      title,
      description,
      date,
      time,
      location,
      capacity,
      price,
      category,
      image,
      instructorId,
      materials,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: validatedFields.error.errors[0]?.message || "Invalid input",
      };
    }

    const [workshop] = await getDB()
      .select()
      .from(workshops)
      .where(eq(workshops.id, id));

    if (!workshop) {
      return { success: false, message: "Workshop not found." };
    }

    // Get current registrations with our new model
    const registrations = workshop.registrations as WorkshopRegistration[] || [];
    
    const currentParticipants = registrations.reduce(
      (sum, reg) => sum + (reg.participants || 1),
      0
    );

    if (capacity < currentParticipants) {
      return {
        success: false,
        message: "New capacity cannot be less than current registrations.",
      };
    }

    await getDB()
      .update(workshops)
      .set({
        title,
        description,
        date,
        time,
        location,
        capacity: Number(capacity),
        price: String(price),
        category,
        image: image || workshop.image,
        materials: materials || workshop.materials,
        isFeatured: isFeatured !== undefined ? isFeatured : workshop.isFeatured,
        spotsLeft: Number(capacity) - currentParticipants
      })
      .where(eq(workshops.id, id));

    return {
      success: true,
      message: "Workshop updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update workshop.",
    };
  }
}

/**
 * Delete a workshop - admin only action
 */
export async function deleteWorkshop(id: string) {
  try {
    // Check admin authorization
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    // Check admin role
    const metadata = sessionClaims?.metadata as { role?: string } || {};
    const isAdmin = metadata.role === 'admin';
    if (!isAdmin) {
      return {
        success: false,
        message: "Unauthorized: Admin access required",
      };
    }
    


    await getDB().delete(workshops).where(eq(workshops.id, id));

    return {
      success: true,
      message: "Workshop deleted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete workshop.",
    };
  }
}

/**
 * Adds a registration to a workshop
 */
export async function addRegistration(
  workshopId: string, 
  userId: string, 
  registrationData: Partial<WorkshopRegistration>
) {
  // First get the current workshop data
  const [workshop] = await getDB()
    .select()
    .from(workshops)
    .where(eq(workshops.id, workshopId));
  
  if (!workshop) {
    return { success: false, message: 'Workshop not found' };
  }
  
  // Check if the workshop is open for registration
  if (!workshop.isRegistrationOpen) {
    return { success: false, message: 'Registration is closed for this workshop' };
  }

  // Get current registrations
  const currentRegistrations = (workshop.registrations as WorkshopRegistration[]) || [];
  
  // Check if user is already registered
  const existingRegistration = currentRegistrations.find(reg => reg.userId === userId);
  if (existingRegistration) {
    return { success: false, message: 'You are already registered for this workshop' };
  }
  
  // Check if workshop is full
  if (currentRegistrations.length >= workshop.capacity) {
    return { success: false, message: 'This workshop is full' };
  }
  
  // Create new registration
  const newRegistration: WorkshopRegistration = {
    userId,
    name: registrationData.name || '',
    email: registrationData.email || '',
    phone: registrationData.phone,
    participants: registrationData.participants || 1,
    specialRequirements: registrationData.specialRequirements,
    paymentStatus: registrationData.paymentStatus || 'pending',
    registeredAt: new Date(),
    updatedAt: new Date()
  };
  
  // Add registration to workshop
  await getDB()
    .update(workshops)
    .set({
      registrations: [...currentRegistrations, newRegistration] as any,
      spotsLeft: Math.max(0, Number(workshop.capacity) - (currentRegistrations.length + 1))
    })
    .where(eq(workshops.id, workshopId));
  
  return { success: true, registration: newRegistration };
}

/**
 * Gets all registrations for a workshop
 */
export async function getWorkshopRegistrations(workshopId: string) {
  const [workshop] = await getDB()
    .select()
    .from(workshops)
    .where(eq(workshops.id, workshopId));
    
  if (!workshop) {
    return { success: false, message: 'Workshop not found' };
  }
  
  const registrations = workshop.registrations as WorkshopRegistration[] || [];
  return { success: true, data: registrations };
}

/**
 * Gets all workshops a user is registered for
 */
export async function getUserWorkshops(userId: string) {
  // Get all workshops
  const allWorkshops = await getDB()
    .select()
    .from(workshops)
    .orderBy(desc(workshops.createdAt));
    
  // Find workshops where user is registered
  const userWorkshops = allWorkshops.filter(workshop => {
    const registrations = workshop.registrations as WorkshopRegistration[] || [];
    return registrations.some(reg => reg.userId === userId);
  });
  
  // Format the results with registration info
  return userWorkshops.map(workshop => {
    const registrations = workshop.registrations as WorkshopRegistration[] || [];
    const userRegistration = registrations.find(reg => reg.userId === userId);
    
    return {
      workshop,
      registration: userRegistration
    };
  });
}

/**
 * Cancel registration for a workshop
 */
export async function cancelRegistration(workshopId: string, userId: string) {
  const [workshop] = await getDB()
    .select()
    .from(workshops)
    .where(eq(workshops.id, workshopId));
  
  if (!workshop) {
    return { success: false, message: 'Workshop not found' };
  }
  
  // Get current registrations
  const registrations = workshop.registrations as WorkshopRegistration[] || [];
  
  // Find user registration
  const registrationIndex = registrations.findIndex(reg => reg.userId === userId);
  
  if (registrationIndex === -1) {
    return { success: false, message: 'Registration not found' };
  }
  
  // Remove registration
  const updatedRegistrations = [...registrations];
  updatedRegistrations.splice(registrationIndex, 1);
  
  // Update workshop
  await getDB()
    .update(workshops)
    .set({
      registrations: updatedRegistrations as any,
      spotsLeft: Number(workshop.spotsLeft) + 1
    })
    .where(eq(workshops.id, workshopId));
    
  return { success: true, message: 'Registration cancelled successfully' };
}

/**
 * Type for workshop resources
 */
export type WorkshopResource = {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link';
  url: string;
  description?: string;
  uploadedAt: string;
};

/**
 * Type for workshop messages
 */
export type WorkshopMessage = {
  id: string;
  userId: string; // TCamp's user ID or participant user ID
  userName: string;
  message: string;
  sentAt: string;
};

/**
 * Add a resource to a workshop
 */
export async function addWorkshopResource(
  workshopId: string, 
  resource: Omit<WorkshopResource, 'id' | 'uploadedAt'>
) {
  const [workshop] = await getDB()
    .select()
    .from(workshops)
    .where(eq(workshops.id, workshopId));
    
  if (!workshop) {
    return { success: false, message: 'Workshop not found' };
  }
  
  // Create new resource with ID and timestamp
  const newResource: WorkshopResource = {
    ...resource,
    id: uuidv4(),
    uploadedAt: new Date().toISOString()
  };
  
  // Add to resources array
  const currentResources = workshop.resources as WorkshopResource[] || [];
  const updatedResources = [...currentResources, newResource];
  
  // Update workshop
  await getDB()
    .update(workshops)
    .set({
      resources: updatedResources as any,
      updatedAt: new Date()
    })
    .where(eq(workshops.id, workshopId));
    
  return { success: true, message: 'Resource added successfully', resource: newResource };
}

/**
 * Remove a resource from a workshop
 */
export async function removeWorkshopResource(workshopId: string, resourceId: string) {
  const [workshop] = await getDB()
    .select()
    .from(workshops)
    .where(eq(workshops.id, workshopId));
    
  if (!workshop) {
    return { success: false, message: 'Workshop not found' };
  }
  
  // Filter out the resource to remove
  const currentResources = workshop.resources as WorkshopResource[] || [];
  const updatedResources = currentResources.filter(resource => resource.id !== resourceId);
  
  if (currentResources.length === updatedResources.length) {
    return { success: false, message: 'Resource not found' };
  }
  
  // Update workshop
  await getDB()
    .update(workshops)
    .set({
      resources: updatedResources as any,
      updatedAt: new Date()
    })
    .where(eq(workshops.id, workshopId));
    
  return { success: true, message: 'Resource removed successfully' };
}

/**
 * Get all resources for a workshop
 */
export async function getWorkshopResources(workshopId: string) {
  const [workshop] = await getDB()
    .select()
    .from(workshops)
    .where(eq(workshops.id, workshopId));
    
  if (!workshop) {
    return { success: false, message: 'Workshop not found' };
  }
  
  const resources = workshop.resources as WorkshopResource[] || [];
  return { success: true, data: resources };
}

/**
 * Add a message to a workshop chat
 */
export async function addWorkshopMessage(
  workshopId: string,
  message: Omit<WorkshopMessage, 'id' | 'sentAt'>
) {
  const [workshop] = await getDB()
    .select()
    .from(workshops)
    .where(eq(workshops.id, workshopId));
    
  if (!workshop) {
    return { success: false, message: 'Workshop not found' };
  }
  
  // Create new message with ID and timestamp
  const newMessage: WorkshopMessage = {
    ...message,
    id: uuidv4(),
    sentAt: new Date().toISOString()
  };
  
  // Add to messages array
  const currentMessages = workshop.messages as WorkshopMessage[] || [];
  const updatedMessages = [...currentMessages, newMessage];
  
  // Update workshop
  await getDB()
    .update(workshops)
    .set({
      messages: updatedMessages as any,
      updatedAt: new Date()
    })
    .where(eq(workshops.id, workshopId));
    
  return { success: true, message: 'Message sent successfully', data: newMessage };
}

/**
 * Get all messages for a workshop
 */
export async function getWorkshopMessages(workshopId: string) {
  const [workshop] = await getDB()
    .select()
    .from(workshops)
    .where(eq(workshops.id, workshopId));
    
  if (!workshop) {
    return { success: false, message: 'Workshop not found' };
  }
  
  const messages = workshop.messages as WorkshopMessage[] || [];
  return { success: true, data: messages };
}
