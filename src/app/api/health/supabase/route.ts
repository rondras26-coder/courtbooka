import { NextResponse } from "next/server";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

/**
 * Dev/admin smoke check: counts venues using the service role (RLS-safe read-back proof).
 * Omit SUPABASE_SERVICE_ROLE_KEY locally if you only want to verify env wiring via `configured`.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasPublishable =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  const configured = Boolean(url && hasPublishable);

  const admin = createSupabaseServiceRoleClient();
  if (!admin) {
    return NextResponse.json({
      ok: configured,
      configured,
      venueCount: null as number | null,
      hint:
        "Set SUPABASE_SERVICE_ROLE_KEY (server-only) to return venueCount across RLS.",
    });
  }

  const { count, error } = await admin
    .from("venues")
    .select("*", { count: "exact", head: true });

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        configured,
        venueCount: null as number | null,
        error: error.message,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    configured,
    venueCount: count ?? 0,
  });
}
