"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

async function resolveAppOrigin(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
  if (!host) {
    return envUrl ?? "http://localhost:3000";
  }
  const protoHeader = hdrs.get("x-forwarded-proto");
  const hostPart = host.split(",")[0]?.trim() ?? host;
  const proto =
    protoHeader?.split(",")[0]?.trim() ??
    (hostPart.includes("localhost") ? "http" : "https");
  return `${proto}://${hostPart}`;
}

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const nextRaw = String(formData.get("next") ?? "").trim();
  const next =
    nextRaw.startsWith("/") && !nextRaw.startsWith("//")
      ? nextRaw
      : "/book";

  if (!email) {
    redirect("/login?error=email_required");
  }

  const origin = await resolveAppOrigin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(error.message)}&email=${encodeURIComponent(email)}`,
    );
  }

  redirect(`/login?sent=1&email=${encodeURIComponent(email)}`);
}
