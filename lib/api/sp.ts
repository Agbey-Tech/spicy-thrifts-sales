import type { Sp } from "@/app/types/database";

// List all SPs
export async function getSps(): Promise<Sp[]> {
  const res = await fetch("/api/sp", { credentials: "include" });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to fetch sps");
  return data;
}

// Create a new SP
export async function createSp(
  input: Omit<Sp, "id" | "created_at" | "updated_at">,
): Promise<Sp> {
  const res = await fetch("/api/sp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to create sp");
  return data;
}

// Update an SP
export async function updateSp(
  spId: string,
  updates: Partial<Sp>,
): Promise<Sp> {
  const res = await fetch(`/api/sp/${spId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updates),
  });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to update sp");
  return data;
}

// Delete an SP
export async function deleteSp(spId: string): Promise<boolean> {
  const res = await fetch(`/api/sp/${spId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to delete sp");
  return data;
}
