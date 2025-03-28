"use server";

import { db } from "@/lib/db/drizzle";

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
import { contacts } from "@/lib/db/schema";
import { contactSchema } from "@/lib/validations";
import { eq, desc } from "drizzle-orm";
import { currentUser, auth } from "@clerk/nextjs/server";

type UserRole = "admin" | "user";
import { v4 as uuidv4 } from "uuid";

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const user = await currentUser();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const department = formData.get("department") as string;

    const validatedFields = contactSchema.safeParse({
      name,
      email,
      subject,
      message,
      department,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: validatedFields.error.errors[0]?.message || "Invalid input",
      };
    }

    const { userId } = await auth();
    await getDB()
      .insert(contacts)
      .values({
        id: uuidv4(),
        userId: userId || undefined,
        name,
        email,

        message,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to submit your message.",
    };
  }
}

export async function getAllContactSubmissions() {
  try {
    const user = await currentUser();
    const { userId } = await auth();
    const userRole = userId ? "admin" : ("user" as UserRole);
    if (!user || userRole !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    const submissions = await getDB()
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));
    return { success: true, data: submissions };
  } catch (error) {
    return { success: false, message: "Failed to fetch contact submissions." };
  }
}

export async function updateContactSubmission(id: string, formData: FormData) {
  try {
    const user = await currentUser();
    const { userId } = await auth();
    const userRole = userId ? "admin" : ("user" as UserRole);
    if (!user || userRole !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    const status = formData.get("status") as string;
    const assignedTo = formData.get("assignedTo") as string;

    await getDB()
      .update(contacts)
      .set({
        status,
        assignedTo,
        updatedAt: new Date(),
      })
      .where(eq(contacts.id, id));

    return {
      success: true,
      message: "Contact submission updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update contact submission.",
    };
  }
}
