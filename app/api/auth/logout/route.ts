import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/interceptors/withErrorHandling";
import { requireAuth } from "@/lib/auth/requireAuth";
import { AuthService } from "@/services/auth.service";

const service = new AuthService();

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAuth(); // Only allow if authenticated
  await service.logout();
  return NextResponse.json({ success: true, data: null, error: null });
});
