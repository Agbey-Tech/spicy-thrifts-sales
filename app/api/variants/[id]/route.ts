import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/interceptors/withErrorHandling";
import { validate } from "@/lib/validators/validate";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";
import { VariantsService } from "@/services/variants.service";
import { updateVariantSchema } from "@/core/validation/variants.schema";

const service = new VariantsService();

// PATCH /api/variants/:id - Update variant (ADMIN, SALES)
export const PATCH = withErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const user = await requireAuth(req);
    await requireRole(user, ["ADMIN", "SALES"]);
    const body = await req.json();
    const input = validate(updateVariantSchema, body);
    const updated = await service.updateVariant(params.id, input, user.role);
    return NextResponse.json({ success: true, data: updated, error: null });
  },
);
