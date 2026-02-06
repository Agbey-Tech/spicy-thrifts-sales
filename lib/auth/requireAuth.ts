import { createSupabaseServerClient } from "../supabase/server";

export async function requireAuth() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");
  if (user.user_metadata?.is_active === false)
    throw new Error("User account is deactivated");
  return user;
}
