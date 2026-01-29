import type { Product } from "@/app/types/database";

// List all products
export async function getProducts(): Promise<Product[]> {
  const res = await fetch("/api/products", { credentials: "include" });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to fetch products");
  return data;
}

// Create a new product (ADMIN only)
export async function createProduct(
  input: Pick<Product, "category_id" | "sp_id" | "stock_quantity">,
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
  updates: Partial<Pick<Product, "category_id" | "sp_id" | "stock_quantity">>,
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
