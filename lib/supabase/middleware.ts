import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  // return NextResponse.next(); // for debugging purpose

  const pathname = request.nextUrl.pathname;

  // Always allow Next.js internals and auth routes
  //   const publicRoutes = [
  //     "/_next",
  //     "/api/auth",
  //     "/signin",
  //     "/signup",
  //     // "/finish-setup",
  //     "/favicon.ico",
  //   ];

  //   if (publicRoutes.some((route) => pathname.startsWith(route))) {
  //     return supabaseResponse;
  //   }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Homepage ("/") always allowed
  if (!user && !pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
