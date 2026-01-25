import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/interceptors/withErrorHandling";
import { validate } from "@/lib/validators/validate";
import { AuthService } from "@/services/auth.service";
import { signUpSchema } from "@/core/validation/auth.schema";

const service = new AuthService();

// POST /api/auth - Create a new user (ADMIN only)
export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  // You may want to add a signUpSchema for validation
  const input = validate(signUpSchema, body);
  const created = await service.signUp(input);
  return NextResponse.json({ success: true, data: created, error: null });
});
