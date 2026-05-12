# Courtbooka

Technical bootstrap for the **Courtbooka** product: a Next.js App Router application aligned with the company stack (React + TypeScript, Tailwind CSS, shadcn/ui + Lucide). Framer Motion is not included yet; add it when a motion-heavy interaction needs it.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) (recommended; matches the lockfile)

### pnpm native dependency builds

pnpm may require explicit approval before packages like `sharp` run install scripts. This repo keeps approvals in `pnpm-workspace.yaml` (`allowBuilds`) after `pnpm approve-builds`, and lists `pnpm.onlyBuiltDependencies` in `package.json` as documentation / redundancy. If install fails with `ERR_PNPM_IGNORED_BUILDS`, run:

```bash
pnpm approve-builds --all && pnpm install
```

## Commands

| Script | Purpose |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Dev server (Turbopack via Next.js defaults where applicable) |
| `pnpm build` | Production build |
| `pnpm start` | Run production server locally |
| `pnpm lint` | ESLint (baseline verification for this milestone) |
| `pnpm smoke:magic-link` | Verifies public Supabase env from `.env.local`; with `SMOKE_BASE_URL=http://localhost:3000` while `pnpm dev` is running, checks `/auth/callback` + `/api/health/supabase` |

After `pnpm dev`, open [http://localhost:3000](http://localhost:3000). **Booking slice:** `/book` lists available slots; `/login` sends an email magic link; successful auth lands on `/auth/callback` then redirects into `/book`.

## Configuration layout

| Path | Purpose |
| --- | --- |
| `next.config.ts` | Next.js configuration |
| `pnpm-workspace.yaml` | pnpm 11+ approved dependency build scripts (`allowBuilds`) |
| `tsconfig.json` | TypeScript / `@/*` → `src/*` paths |
| `eslint.config.mjs` | ESLint flat config |
| `postcss.config.mjs` | PostCSS (Tailwind v4 pipeline) |
| `components.json` | shadcn/ui CLI registry and aliases |
| `src/app/globals.css` | Tailwind import + theme CSS variables |
| `src/components/ui/` | shadcn-generated components (e.g. `button`) |
| `src/lib/utils.ts` | `cn()` helper for class merging |
| `src/lib/supabase/` | `@supabase/ssr` browser + server clients; service-role helper |
| `supabase/config.toml` | Supabase CLI project (local dev + `db.seed` path); link remote with `supabase link` |
| `supabase/migrations/` | Ordered Postgres migrations for Supabase |
| `.env.example` | Safe env template — copy to `.env.local` |

Environment-specific secrets belong in `.env.local` (not committed). For UI-only smoke you can omit Supabase vars; middleware skips auth refresh until URL + anon/publishable key are present.

## Database (Supabase)

Courtbooka targets **Supabase Postgres** ([RONA-1048](/RONA/issues/RONA-1048)).

1. Copy `.env.example` → `.env.local` and fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). Set `NEXT_PUBLIC_SITE_URL` to the same origin users open in the browser (e.g. `http://localhost:3000` or your Vercel URL) so magic-link `emailRedirectTo` stays consistent when the app runs without forwarded headers. Optionally add `SUPABASE_SERVICE_ROLE_KEY` **only on the server** for admin/read-back tooling — never expose it via `NEXT_PUBLIC_*`.
2. Apply migrations in filename order (`supabase/migrations/`). Options:
   - Supabase Dashboard → SQL → paste each migration file; or
   - Supabase CLI: `pnpm dlx supabase@latest login`, then `pnpm dlx supabase@latest link --project-ref <ref>`, then `pnpm dlx supabase@latest db push` ([CLI docs](https://supabase.com/docs/guides/cli)).
3. Seed demo rows (venue → court → slot): `supabase/config.toml` enables `[db.seed]` against `./seed.sql`. For a **remote** linked project run `pnpm dlx supabase@latest db query --linked -f supabase/seed.sql` (or paste `supabase/seed.sql` in the SQL editor). For **local** `supabase start`, `pnpm dlx supabase@latest db reset` applies migrations then seed. Inserts into `bookings` require an existing `auth.users` row — uncomment the sample block in `seed.sql` once you have a user UUID.

### Auth: Site URL and redirect allowlist (magic link)

In the Supabase dashboard under **Authentication → URL configuration**:

| Setting | Example values |
| --- | --- |
| **Site URL** | `http://localhost:3000` for dev; production `https://<your-app>` (must match where users finish login). |
| **Redirect URLs** | Add every origin that may complete the OTP exchange: `http://localhost:3000/auth/callback`, `http://127.0.0.1:3000/auth/callback`, preview URLs like `https://*.vercel.app/auth/callback` if you use them, and production `https://<your-app>/auth/callback`. |

`src/app/login/actions.ts` sets `emailRedirectTo` to `{origin}/auth/callback?next=…` where `origin` comes from `NEXT_PUBLIC_SITE_URL` or the incoming `Host` / `x-forwarded-*` headers. Anything not listed under **Redirect URLs** will be rejected when the user clicks the link.

### Row Level Security

Booking tables use **RLS with explicit policies** (see `supabase/migrations/20260512170000_booking_rls_policies.sql`):

- **venues / courts / court_slots** — `SELECT` for `anon` and `authenticated` so the catalog and grid load through the anon key before sign-in.
- **bookings** — `SELECT` and `INSERT` for `authenticated` only, scoped to `auth.uid() = user_id`.
- **Triggers** — `BEFORE INSERT` locks the slot row (`FOR UPDATE`), ensures `status = 'available'`, and checks `user_id` matches the JWT when present. `AFTER INSERT` sets the slot to `booked` via a **SECURITY DEFINER** function so the session role does not need `UPDATE` on `court_slots`.

Direct SQL seeds that run without a JWT still skip the `user_id` / `auth.uid()` equality check (superuser / project SQL editor only). Prefer app sign-up + magic link for real bookings.

### Magic-link smoke (automated wiring check)

With `.env.local` populated, run `pnpm smoke:magic-link` to verify env. With `pnpm dev` in another terminal:

```bash
SMOKE_BASE_URL=http://localhost:3000 pnpm smoke:magic-link
```

That confirms `/auth/callback` rejects missing `code` with a redirect to `missing_code`, and `/api/health/supabase` sees your project as configured. It does **not** send email; complete OTP manually once per environment.

### Persistence smoke check

With migrations + seed applied and `SUPABASE_SERVICE_ROLE_KEY` set locally, start `pnpm dev` and open `/api/health/supabase`. You should see JSON with `"venueCount"` reflecting seeded venues. Without the service role key the route still reports whether public env vars are configured.

## Milestone: done means

For **[RONA-961](/RONA/issues/RONA-961)** (technical project bootstrap):

- Dependencies install cleanly with the documented pnpm approach.
- `pnpm lint` passes.
- `pnpm dev` serves the app; the home page renders with shadcn `Button` + Lucide icon (proof of UI stack wiring).

Follow-on work (database, HubSpot, portals, etc.) is tracked separately from this scaffold.

## Adding UI components

```bash
pnpm dlx shadcn@latest add <component>
```
