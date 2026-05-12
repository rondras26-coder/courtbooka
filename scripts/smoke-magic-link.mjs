#!/usr/bin/env node
/**
 * Magic-link / Supabase auth wiring smoke (RONA-1058).
 *
 * 1) Loads `.env.local` if present (no extra deps).
 * 2) Verifies public Supabase env is set.
 * 3) If SMOKE_BASE_URL is set (e.g. http://localhost:3000), expect `pnpm dev` running:
 *    - GET /auth/callback without ?code → redirect to /login?error=missing_code
 *    - GET /api/health/supabase → JSON with configured / venueCount
 *
 * Usage:
 *   pnpm smoke:magic-link
 *   SMOKE_BASE_URL=http://localhost:3000 pnpm smoke:magic-link
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

function loadEnvLocal() {
  const p = resolve(process.cwd(), ".env.local");
  if (!existsSync(p)) return;
  const text = readFileSync(p, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

function requirePublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or PUBLISHABLE_KEY). Copy .env.example → .env.local.",
    );
    process.exit(1);
  }
  return { url, hasKey: Boolean(key) };
}

async function followRedirectOnce(base, path) {
  const u = new URL(path, base);
  const res = await fetch(u, { redirect: "manual" });
  return res;
}

async function main() {
  loadEnvLocal();
  requirePublicSupabase();

  const base = process.env.SMOKE_BASE_URL?.replace(/\/$/, "");
  if (!base) {
    console.log(
      "Env OK (public Supabase variables present). Set SMOKE_BASE_URL=http://localhost:3000 with `pnpm dev` running to verify HTTP routes.",
    );
    return;
  }

  const cb = await followRedirectOnce(base, "/auth/callback");
  if (cb.status < 300 || cb.status >= 400) {
    console.error(
      `Expected 3xx from GET /auth/callback (no code), got ${cb.status}`,
    );
    process.exit(1);
  }
  const loc = cb.headers.get("location") ?? "";
  if (!loc.includes("missing_code")) {
    console.error(
      `Expected redirect to login?error=missing_code, got Location: ${loc}`,
    );
    process.exit(1);
  }

  const health = await fetch(new URL("/api/health/supabase", base));
  if (!health.ok) {
    console.error(`GET /api/health/supabase → ${health.status}`);
    process.exit(1);
  }
  const body = await health.json();
  if (body.configured !== true) {
    console.error("Health reports Supabase not configured:", body);
    process.exit(1);
  }

  console.log("Smoke OK:", {
    callbackRedirect: "missing_code",
    health: { ok: body.ok, venueCount: body.venueCount },
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
