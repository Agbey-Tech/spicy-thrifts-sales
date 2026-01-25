import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/interceptors/withErrorHandling";
import { validate } from "@/lib/validators/validate";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";
import { ProductsService } from "@/services/products.service";
import { updateProductSchema } from "@/core/validation/products.schema";

const service = new ProductsService();

// PATCH /api/products/:id - Update product (ADMIN only)
export const PATCH = withErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const user = await requireAuth();
    const { id } = await params;
    await requireRole(user, ["ADMIN"]);
    const body = await req.json();
    const input = validate(updateProductSchema, body);
    const updated = await service.updateProduct(id, input);
    return NextResponse.json({ success: true, data: updated, error: null });
  },
);

// DELETE /api/products/:id - Delete product (ADMIN only)
export const DELETE = withErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const user = await requireAuth();
    const { id } = await params;
    await requireRole(user, ["ADMIN"]);
    const deleted = await service.deleteProduct(id);
    return NextResponse.json({ success: true, data: deleted, error: null });
  },
);
