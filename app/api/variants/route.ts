import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/interceptors/withErrorHandling";
import { validate } from "@/lib/validators/validate";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";
import { VariantsService } from "@/services/variants.service";
import {
  createVariantSchema,
  updateVariantSchema,
} from "@/core/validation/variants.schema";

const service = new VariantsService();

// GET /api/variants - List variants (ADMIN, SALES)
export const GET = withErrorHandling(async (req: NextRequest) => {
  const user = await requireAuth();
  await requireRole(user, ["ADMIN", "SALES"]);
  const filters: Record<string, any> = {};
  const url = req.nextUrl;
  if (url.searchParams.has("sku")) filters.sku = url.searchParams.get("sku");
  if (url.searchParams.has("category_id"))
    filters.category_id = url.searchParams.get("category_id");
  if (url.searchParams.has("size")) filters.size = url.searchParams.get("size");
  if (url.searchParams.has("primary_color"))
    filters.primary_color = url.searchParams.get("primary_color");
  const variants = await service.listVariants(filters);
  return NextResponse.json({ success: true, data: variants, error: null });
});

// POST /api/variants - Create variant (ADMIN only)
export const POST = withErrorHandling(async (req: NextRequest) => {
  const user = await requireAuth();
  await requireRole(user, ["ADMIN"]);
  const body = await req.json();
  const input = validate(createVariantSchema, body);
  const created = await service.createVariant(input);
  return NextResponse.json({ success: true, data: created, error: null });
});
