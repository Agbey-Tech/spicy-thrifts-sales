import type { Product } from "@/app/types/database";

// List all products (optionally include variants)
export async function getProducts(options?: {
  includeVariants?: boolean;
}): Promise<Product[]> {
  const url = new URL("/api/products", window.location.origin);
  if (options?.includeVariants) url.searchParams.set("includeVariants", "true");
  const res = await fetch(url.toString(), { credentials: "include" });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to fetch products");
  return data;
}

// Create a new product (ADMIN only)
export async function createProduct(
  input: Omit<Product, "id" | "created_at">,
): Promise<Product> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to create product");
  return data;
}

// Update a product (ADMIN only)
export async function updateProduct(
  productId: string,
  updates: Partial<Product>,
): Promise<Product> {
  const res = await fetch(`/api/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updates),
  });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to update product");
  return data;
}

// Delete a product (ADMIN only)
export async function deleteProduct(productId: string): Promise<boolean> {
  const res = await fetch(`/api/products/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to delete product");
  return data;
}
