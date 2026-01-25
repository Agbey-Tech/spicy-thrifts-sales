import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/interceptors/withErrorHandling";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";
import { OrdersService } from "@/services/orders.service";

const service = new OrdersService();

// GET /api/orders/:id - Get single order (ADMIN, SALES)
export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const user = await requireAuth();
    const { id } = await params;
    await requireRole(user, ["ADMIN", "SALES"]);
    const order = await service.getOrder(id);
    return NextResponse.json({ success: true, data: order, error: null });
  },
);
