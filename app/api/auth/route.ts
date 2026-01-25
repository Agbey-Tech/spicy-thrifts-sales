import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/interceptors/withErrorHandling";
import { validate } from "@/lib/validators/validate";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";
import { AuthService } from "@/services/auth.service";
import {
  updateUserSchema,
  createUserSchema,
} from "@/core/validation/auth.schema";

const service = new AuthService();

// GET /api/auth - List all users (ADMIN only)
export const GET = withErrorHandling(async (req: NextRequest) => {
  const user = await requireAuth();
  await requireRole(user, ["ADMIN"]);
  const users = await service.listUsers();
  return NextResponse.json({ success: true, data: users, error: null });
});

// POST /api/auth - Create a new user (ADMIN only)
export const POST = withErrorHandling(async (req: NextRequest) => {
  const user = await requireAuth();
  await requireRole(user, ["ADMIN"]);
  const body = await req.json();
  // You may want to add a createUserSchema for validation
  const input = validate(createUserSchema, body);
  const created = await service.createUser(input);
  return NextResponse.json({ success: true, data: created, error: null });
});

// PATCH /api/auth - Update a user (ADMIN only)
export const PATCH = withErrorHandling(async (req: NextRequest) => {
  const user = await requireAuth();
  await requireRole(user, ["ADMIN"]);
  const body = await req.json();
  const { userId, updates } = body;
  const input = validate(updateUserSchema, updates);
  const updated = await service.updateUser(userId, input);
  return NextResponse.json({ success: true, data: updated, error: null });
});
