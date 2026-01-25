import { createServiceClient } from "@/lib/supabase/service";
import { salesReportQuerySchema } from "@/core/validation/reports.schema";

export class ReportsService {
  private supabase = createServiceClient();

  // Get sales summary for a date range (ADMIN)
  async getSalesSummary(input: unknown) {
    const { from, to } = salesReportQuerySchema.parse(input);
    // Query total sales and order count in the range
    const { data, error } = await this.supabase
      .from("orders")
      .select("total_amount, created_at")
      .gte("created_at", from)
      .lte("created_at", to);
    if (error) throw new Error(error.message);
    const totalSales = data.reduce((sum, o) => sum + Number(o.total_amount), 0);
    return {
      totalSales,
      orderCount: data.length,
      from,
      to,
    };
  }
}
