import type { ProductVariant } from "@/app/types/database";

// List all variants (with optional filters)
export async function getVariants(filters?: {
  sku?: string;
  category_id?: string;
  size?: string;
  primary_color?: string;
}): Promise<ProductVariant[]> {
  const url = new URL("/api/variants", window.location.origin);
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }
  const res = await fetch(url.toString(), { credentials: "include" });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to fetch variants");
  return data;
}

// Create a new variant (ADMIN only)
export async function createVariant(
  input: Omit<ProductVariant, "id" | "created_at">,
): Promise<ProductVariant> {
  const res = await fetch("/api/variants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to create variant");
  return data;
}

// Update a variant (ADMIN, SALES)
export async function updateVariant(
  variantId: string,
  updates: Partial<ProductVariant>,
): Promise<ProductVariant> {
  const res = await fetch(`/api/variants/${variantId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updates),
  });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to update variant");
  return data;
}
