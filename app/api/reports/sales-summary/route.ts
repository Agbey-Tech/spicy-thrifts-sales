import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/interceptors/withErrorHandling";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";
import { validate } from "@/lib/validators/validate";
import { ReportsService } from "@/services/reports.service";
import { salesReportQuerySchema } from "@/core/validation/reports.schema";

const service = new ReportsService();

// GET /api/reports/sales-summary?from=...&to=...
export const GET = withErrorHandling(async (req: NextRequest) => {
  const user = await requireAuth();
  await requireRole(user, ["ADMIN"]);
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");
  const input = validate(salesReportQuerySchema, { from, to });
  const summary = await service.getSalesSummary(input);
  return NextResponse.json({ success: true, data: summary, error: null });
});
