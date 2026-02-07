import { createServiceClient } from "@/lib/supabase/service";
import { salesReportQuerySchema } from "@/core/validation/reports.schema";

export class ReportsService {
  private supabase = createServiceClient();

  // Get sales summary for a date range (ADMIN)
  async getSalesSummary(input: unknown) {
    const { from, to, userId } = salesReportQuerySchema.parse(input);
    let query = this.supabase
      .from("orders")
      .select("total_amount, created_at, sales_person_id")
      .gte("created_at", from)
      .lte("created_at", to);
    console.log("Querying sales summary with:", { from, to, userId });
    if (userId) {
      query = query.eq("sales_person_id", userId);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const totalSales = data.reduce((sum, o) => sum + Number(o.total_amount), 0);
    return {
      totalSales,
      orderCount: data.length,
      from,
      to,
      userId: userId || null,
      orders: data,
    };
  }

  // Get low stock variants (ADMIN)
  async getLowStockProducts(threshold: number = 3) {
    // Query variants with stock_quantity <= threshold, include product info
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .lte("stock_quantity", threshold)
      .order("stock_quantity", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  }
}
