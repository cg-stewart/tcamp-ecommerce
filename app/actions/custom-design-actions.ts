"use server";

import { currentUser, auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db/drizzle";
import { customDesigns } from "@/lib/db/schema";
import { customDesignSchema } from "@/lib/validations";

type UserRole = "admin" | "user";

/**
 * Helper function to check database connection
 * @returns The database instance if it exists
 * @throws Error if database connection is not available
 */
function getDB() {
  if (typeof db === "undefined") {
    throw new Error("Database connection not available");
  }
  return db;
}

export async function submitCustomDesignRequest(
  prevState: any,
  formData: FormData
) {
  try {
    const user = await currentUser();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const style = formData.get("style") as string;
    const dimensions = formData.get("dimensions") as string;
    const colors = JSON.parse((formData.get("colors") as string) || "[]");
    const additionalNotes = formData.get("additionalNotes") as string;
    const budget = Number.parseInt(formData.get("budget") as string);
    const timeline = formData.get("timeline") as string;
    const attachments = JSON.parse(
      (formData.get("attachments") as string) || "[]"
    );

    const validatedFields = customDesignSchema.safeParse({
      title,
      description,
      requirements: {
        style,
        dimensions,
        colors,
        additionalNotes,
      },
      budget,
      timeline,
      attachments,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: validatedFields.error.errors[0]?.message || "Invalid input",
      };
    }

    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not authenticated.",
      };
    }

    await getDB().insert(customDesigns).values({
      userId,
      title,
      description,
      requirements: {
        style,
        dimensions,
        colors,
        additionalNotes,
      },
      budget,
      timeline,
      attachments,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      message: "Design request submitted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to submit design request.",
    };
  }
}

export async function getUserCustomDesigns() {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, message: "User not authenticated." };
    }

    const designs = await getDB()
      .select()
      .from(customDesigns)
      .where(eq(customDesigns.userId, user.id))
      .orderBy(desc(customDesigns.createdAt));

    return { success: true, data: designs };
  } catch (error) {
    return { success: false, message: "Failed to fetch your custom designs." };
  }
}

export async function getAllCustomDesigns() {
  try {
    const user = await currentUser();
    const { userId } = await auth();
    const userRole = userId ? "admin" : ("user" as UserRole);
    if (!user || userRole !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    const designs = await getDB()
      .select()
      .from(customDesigns)
      .orderBy(desc(customDesigns.createdAt));
    return { success: true, data: designs };
  } catch (error) {
    return { success: false, message: "Failed to fetch custom designs." };
  }
}

export async function updateCustomDesignStatus(id: string, formData: FormData) {
  try {
    const user = await currentUser();
    const { userId } = await auth();
    const userRole = userId ? "admin" : ("user" as UserRole);
    if (!user || userRole !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    const status = formData.get("status") as string;
    const designerId = formData.get("designerId") as string;
    const feedback = formData.get("feedback") as string;
    const rating = Number.parseInt((formData.get("rating") as string) || "0");

    const existingDesign = await getDB()
      .select()
      .from(customDesigns)
      .where(eq(customDesigns.id, id))
      .then(rows => rows[0]);

    if (!existingDesign) {
      return {
        success: false,
        message: "Design not found.",
      };
    }

    const existingFeedback = existingDesign.feedback ? JSON.parse(existingDesign.feedback as string) : [];

    await getDB()
      .update(customDesigns)
      .set({
        status,
        feedback: feedback
          ? JSON.stringify([
              ...existingFeedback,
              {
                message: feedback,
                rating: rating || null,
                timestamp: new Date().toISOString(),
              },
            ])
          : existingDesign.feedback,
        updatedAt: new Date(),
      })
      .where(eq(customDesigns.id, id));

    return {
      success: true,
      message: "Design status updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update design status.",
    };
  }
}
