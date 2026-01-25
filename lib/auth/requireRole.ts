import { User } from "@supabase/auth-js";

export async function requireRole(user: User, allowedRoles: string[]) {
  if (
    !user.user_metadata.role ||
    !allowedRoles.includes(user.user_metadata.role)
  ) {
    throw new Error("Forbidden");
  }
}
