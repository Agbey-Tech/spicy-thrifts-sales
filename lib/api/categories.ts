import type { Category } from "@/app/types/database";

// List all categories
export async function getCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories", { credentials: "include" });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to fetch categories");
  return data;
}

// Create a new category (ADMIN only)
export async function createCategory(input: {
  name: string;
  code: string;
}): Promise<Category> {
  const res = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to create category");
  return data;
}

// Update a category (ADMIN only)
export async function updateCategory(
  categoryId: string,
  updates: { name?: string; code?: string },
): Promise<Category> {
  const res = await fetch(`/api/categories/${categoryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updates),
  });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to update category");
  return data;
}
