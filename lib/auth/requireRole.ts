export async function requireRole(
  user: { role: string },
  allowedRoles: string[],
) {
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }
}
