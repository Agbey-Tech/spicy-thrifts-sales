import { createSupabaseServerClient } from "../supabase/server";

export async function requireAuth() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");
  return user;
}
