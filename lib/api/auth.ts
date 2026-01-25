import type { UserRole } from "@/app/types/database";

export interface AuthMeResponse {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
}

export async function getAuthMe(): Promise<AuthMeResponse> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to fetch user profile");
  return data;
}

export async function logout(): Promise<void> {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  const { success, error } = await res.json();
  if (!success) throw new Error(error || "Logout failed");
}

// Admin: List all users
export async function listUsers(): Promise<any[]> {
  const res = await fetch("/api/auth", { credentials: "include" });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to list users");
  return data;
}

// Admin: Create a new user
export async function createUser(input: any): Promise<any> {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to create user");
  return data;
}

// Admin: Update a user
export async function updateUser(userId: string, updates: any): Promise<any> {
  const res = await fetch("/api/auth", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId, updates }),
  });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to update user");
  return data;
}

// Admin: Update a user (from /api/auth/me PATCH)
export async function adminUpdateUser(
  userId: string,
  updates: any,
): Promise<any> {
  // Alias for updateUser
  return updateUser(userId, updates);
}
