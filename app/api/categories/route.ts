import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/interceptors/withErrorHandling";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";
import { validate } from "@/lib/validators/validate";
import { CategoriesService } from "@/services/categories.service";
import { createCategorySchema } from "@/core/validation/categories.schema";

const service = new CategoriesService();

// GET /api/categories - List all categories (ADMIN, SALES)
export const GET = withErrorHandling(async (req: NextRequest) => {
  const user = await requireAuth(req);
  await requireRole(user, ["ADMIN", "SALES"]);
  const categories = await service.listCategories();
  return NextResponse.json({ success: true, data: categories, error: null });
});

// POST /api/categories - Create a new category (ADMIN only)
export const POST = withErrorHandling(async (req: NextRequest) => {
  const user = await requireAuth(req);
  await requireRole(user, ["ADMIN"]);
  const body = await req.json();
  const input = validate(createCategorySchema, body);
  const created = await service.createCategory(input);
  return NextResponse.json({ success: true, data: created, error: null });
});
