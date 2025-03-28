"use server";

import { db } from "@/lib/db/drizzle";
import { newsletters } from "@/lib/db/schema";
import { newsletterSchema } from "@/lib/validations";
import { eq, desc } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

/**
 * Subscribe to newsletter - public action that can be used by unauthenticated users
 */
export async function subscribeToNewsletter(
  prevState: any,
  formData: FormData
) {
  try {
    // Get current user if authenticated (optional)
    const { userId } = await auth();
    const user = userId ? await currentUser() : null;

    const email = formData.get("email") as string;
    const source = (formData.get("source") as string) || "website";
    const categories = JSON.parse(
      (formData.get("categories") as string) || "[]"
    );
    const frequency = (formData.get("frequency") as string) || "weekly";

    const validatedFields = newsletterSchema.safeParse({
      email,
      preferences: {
        categories,
        frequency,
      },
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message:
          validatedFields.error.errors[0]?.message || "Invalid email address",
      };
    }

    // Check for database connection
    if (typeof db === 'undefined') {
      return {
        success: false,
        message: "Database connection error",
      };
    }

    // Check if already subscribed
    const existingSubscriber = await db
      .select()
      .from(newsletters)
      .where(eq(newsletters.email, email));

    if (existingSubscriber.length > 0) {
      return {
        success: true,
        message: "You're already subscribed to our newsletter!",
      };
    }

    // Create a subscription
    await db.insert(newsletters).values({
      id: uuidv4(),
      email,
      isSubscribed: true,
      preferences: {
        source,
        categories,
        frequency,
        userId: user?.id || null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "Failed to subscribe to the newsletter.",
    };
  }
}

/**
 * Unsubscribe from newsletter by email (public action)
 */
export async function unsubscribeFromNewsletter(email: string) {
  try {
    // Check for database connection
    if (typeof db === 'undefined') {
      return {
        success: false,
        message: "Database connection error",
      };
    }

    const [subscriber] = await db
      .select()
      .from(newsletters)
      .where(eq(newsletters.email, email));

    if (!subscriber) {
      return {
        success: false,
        message: "Email address not found in our newsletter list.",
      };
    }

    await db
      .update(newsletters)
      .set({
        isSubscribed: false,
        updatedAt: new Date(),
      })
      .where(eq(newsletters.id, subscriber.id));

    return {
      success: true,
      message: "You have been successfully unsubscribed.",
    };
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return {
      success: false,
      message: "Failed to unsubscribe from the newsletter.",
    };
  }
}

/**
 * Get all newsletter subscribers - admin only action
 */
export async function getAllNewsletterSubscribers() {
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

    // Check for database connection
    if (typeof db === 'undefined') {
      return {
        success: false,
        message: "Database connection error",
      };
    }

    const subscribers = await db
      .select()
      .from(newsletters)
      .orderBy(desc(newsletters.createdAt));

    return {
      success: true,
      data: subscribers,
    };
  } catch (error) {
    console.error("Get newsletter subscribers error:", error);
    return {
      success: false,
      message: "Failed to fetch newsletter subscribers.",
    };
  }
}

/**
 * Update subscriber preferences - admin only action
 */
export async function updateSubscriberPreferences(
  id: string,
  formData: FormData
) {
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

    // Check for database connection
    if (typeof db === 'undefined') {
      return {
        success: false,
        message: "Database connection error",
      };
    }
    
    const isSubscribed = formData.get("status") === "active";
    const categories = JSON.parse(
      (formData.get("categories") as string) || "[]"
    );
    const frequency = formData.get("frequency") as string;

    // Get existing preferences to merge
    const [subscriber] = await db
      .select()
      .from(newsletters)
      .where(eq(newsletters.id, id));

    if (!subscriber) {
      return {
        success: false,
        message: "Subscriber not found",
      };
    }

    const currentPreferences = subscriber.preferences || {};
    
    await db
      .update(newsletters)
      .set({
        isSubscribed,
        preferences: {
          ...currentPreferences,
          categories,
          frequency,
        },
        updatedAt: new Date(),
      })
      .where(eq(newsletters.id, id));

    return {
      success: true,
      message: "Subscriber preferences updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update subscriber preferences.",
    };
  }
}
