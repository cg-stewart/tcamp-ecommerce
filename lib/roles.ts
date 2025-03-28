import { currentUser } from "@clerk/nextjs/server";

export type Role = "admin" | "user";

export async function hasRole(role: Role): Promise<boolean> {
  const user = await currentUser();
  
  if (!user) {
    return false;
  }

  // Check the user's public metadata for their role
  const userRole = user.publicMetadata.role as Role | undefined;
  return userRole === role;
}

export async function checkRole(role: Role) {
  const hasRequiredRole = await hasRole(role);
  if (!hasRequiredRole) {
    throw new Error("Unauthorized");
  }
}
