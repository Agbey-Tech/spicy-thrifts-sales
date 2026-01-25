import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/interceptors/withErrorHandling";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";
import { validate } from "@/lib/validators/validate";
import { CategoriesService } from "@/services/categories.service";
import { updateCategorySchema } from "@/core/validation/categories.schema";

const service = new CategoriesService();

// PATCH /api/categories/:id - Update category (ADMIN only)
export const PATCH = withErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const user = await requireAuth();
    await requireRole(user, ["ADMIN"]);
    const { id } = await params;
    const body = await req.json();
    const input = validate(updateCategorySchema, body);
    const updated = await service.updateCategory(id, input);
    return NextResponse.json({ success: true, data: updated, error: null });
  },
);
