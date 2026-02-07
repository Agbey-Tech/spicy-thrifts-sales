import type { Order } from "@/app/types/database";

// List all orders (ADMIN only)
export async function getOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders", { credentials: "include" });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to fetch orders");
  return data;
}

// Get a single order by ID (ADMIN, SALES)
export async function getOrder(orderId: string): Promise<any> {
  const res = await fetch(`/api/orders/${orderId}`, { credentials: "include" });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to fetch order");
  return data;
}

// Create a new order (ADMIN, SALES)
export async function createOrder(input: {
  order_type: "IN_STORE" | "PHONE_ORDER";
  payment_method: "CASH" | "MOMO" | "TRANSFER";
  customer_name?: string;
  customer_phone?: string;
  delivery_address?: string;
  items: { product_id: string; quantity: number }[];
}): Promise<Order> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to create order");
  return data;
}

// Reverse (delete) an order (ADMIN only)
export async function reverseOrder(orderId: string): Promise<any> {
  const res = await fetch(`/api/orders/${orderId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to reverse order");
  return data;
}
