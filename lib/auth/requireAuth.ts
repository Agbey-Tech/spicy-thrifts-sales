import { NextRequest } from "next/server";
import { createServerClient } from "../supabase/server";

export async function requireAuth(req: NextRequest) {
  const accessToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!accessToken) throw new Error("Unauthorized");
  const supabase = createServerClient(accessToken);
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) throw new Error("Unauthorized");
  return data.user;
}
