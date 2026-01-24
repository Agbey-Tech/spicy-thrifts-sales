import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/interceptors/withErrorHandling";
import { requireAuth } from "@/lib/auth/requireAuth";
import { AuthService } from "@/services/auth.service";

const service = new AuthService();

export const GET = withErrorHandling(async (req: NextRequest) => {
  const user = await requireAuth(req);
  const profile = await service.getProfile(user.id);
  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: profile.role,
      full_name: profile.full_name,
    },
    error: null,
  });
});

export const PATCH = withErrorHandling(async (req: NextRequest) => {
  const admin = await requireAuth(req);
  const body = await req.json();

  // Only allow admins to update users
  if (admin.role !== "admin") {
    return NextResponse.json(
      { success: false, data: null, error: "Unauthorized" },
      { status: 403 },
    );
  }

  const { userId, updates } = body;
  // TODO: Allow admin to deactivate a user by setting is_active to false

  const updatedUser = await service.updateUser(userId, updates);

  return NextResponse.json({
    success: true,
    data: updatedUser,
    error: null,
  });
});
