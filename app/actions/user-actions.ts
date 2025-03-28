"use server";

import { currentUser, auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";

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

export async function getAllUsers() {
  try {
    const user = await currentUser();
    const { userId } = await auth();
    const userRole = userId ? "admin" : "user";
    if (!user || userRole !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    const allUsers = await getDB()
      .select()
      .from(users)
      .orderBy(users.createdAt);

    return { success: true, data: allUsers };
  } catch (error) {
    return { success: false, message: "Failed to fetch users." };
  }
}

export async function updateUser(id: string, formData: FormData) {
  try {
    const user = await currentUser();
    const { userId } = await auth();
    const userRole = userId ? "admin" : "user";
    if (!user || userRole !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    const role = formData.get("role") as string;
    const status = formData.get("status") as string;

    await getDB()
      .update(users)
      .set({
        role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));

    return {
      success: true,
      message: "User updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update user.",
    };
  }
}
