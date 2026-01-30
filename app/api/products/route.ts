import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/interceptors/withErrorHandling";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";
import { validate } from "@/lib/validators/validate";
import { ProductsService } from "@/services/products.service";
import { createProductSchema } from "@/core/validation/products.schema";

const service = new ProductsService();

// GET /api/products - List all products (ADMIN, SALES)
export const GET = withErrorHandling(async (_req: NextRequest) => {
  const user = await requireAuth();
  await requireRole(user, ["ADMIN", "SALES"]);
  const products = await service.listProducts();
  return NextResponse.json({ success: true, data: products, error: null });
});

// POST /api/products - Create a new product (ADMIN only)
export const POST = withErrorHandling(async (req: NextRequest) => {
  const user = await requireAuth();
  await requireRole(user, ["ADMIN"]);
  const body = await req.json();
  const input = validate(createProductSchema, body);
  const created = await service.createProduct(input);
  return NextResponse.json({ success: true, data: created, error: null });
});
