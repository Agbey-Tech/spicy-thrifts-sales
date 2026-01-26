// Get sales summary report (ADMIN only)
export async function getSalesSummary(
  from: string,
  to: string,
): Promise<{
  totalSales: number;
  orderCount: number;
  from: string;
  to: string;
  orders: [{ created_at: string; total_amount: number }];
}> {
  const url = new URL("/api/reports/sales-summary", window.location.origin);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);
  const res = await fetch(url.toString(), { credentials: "include" });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to fetch sales summary");
  return data;
}

// Get low stock variants (ADMIN only)
export async function getLowStockVariants(
  threshold: number = 3,
): Promise<any[]> {
  const url = new URL("/api/reports/low-stock", window.location.origin);
  url.searchParams.set("threshold", String(threshold));
  const res = await fetch(url.toString(), { credentials: "include" });
  const { success, data, error } = await res.json();
  if (!success) throw new Error(error || "Failed to fetch low stock variants");
  return data;
}
