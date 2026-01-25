import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/interceptors/withErrorHandling";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";
import { validate } from "@/lib/validators/validate";
import { OrdersService } from "@/services/orders.service";
import { createOrderSchema } from "@/core/validation/orders.schema";

const service = new OrdersService();

// GET /api/orders - List all orders (ADMIN only)
export const GET = withErrorHandling(async (req: NextRequest) => {
  const user = await requireAuth();
  await requireRole(user, ["ADMIN"]);
  const orders = await service.listOrders();
  return NextResponse.json({ success: true, data: orders, error: null });
});

// POST /api/orders - Create order (ADMIN, SALES)
export const POST = withErrorHandling(async (req: NextRequest) => {
  const user = await requireAuth();
  await requireRole(user, ["ADMIN", "SALES"]);
  const body = await req.json();
  const input = validate(createOrderSchema, body);
  const created = await service.createOrder(input, user.id);
  return NextResponse.json({ success: true, data: created, error: null });
});
