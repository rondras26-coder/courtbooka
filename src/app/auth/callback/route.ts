import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Supabase Auth: exchanges PKCE `code` from magic link for a session cookie.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next =
    requestUrl.searchParams.get("next") ??
    requestUrl.searchParams.get("redirect_to") ??
    "/book";

  if (!code) {
    return NextResponse.redirect(
      new URL(`/login?error=missing_code`, requestUrl.origin),
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.redirect(
      new URL(`/login?error=missing_env`, requestUrl.origin),
    );
  }

  const cookieStore = await cookies();
  const response = NextResponse.redirect(new URL(next, requestUrl.origin));

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error.message)}`,
        requestUrl.origin,
      ),
    );
  }

  return response;
}
