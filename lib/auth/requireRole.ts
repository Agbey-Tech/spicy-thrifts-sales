export async function requireRole(
  user: { role?: string },
  allowedRoles: string[],
) {
  if (!user.role || !allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }
}
