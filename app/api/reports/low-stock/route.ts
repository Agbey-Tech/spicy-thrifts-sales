import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/interceptors/withErrorHandling";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";
import { ReportsService } from "@/services/reports.service";

const service = new ReportsService();

// GET /api/reports/low-stock?threshold=3
export const GET = withErrorHandling(async (req: NextRequest) => {
  const user = await requireAuth(req);
  await requireRole(user, ["ADMIN"]);
  const threshold = parseInt(
    req.nextUrl.searchParams.get("threshold") || "3",
    10,
  );
  const variants = await service.getLowStockVariants(threshold);
  return NextResponse.json({ success: true, data: variants, error: null });
});
