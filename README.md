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

After `pnpm dev`, open [http://localhost:3000](http://localhost:3000).

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
| `supabase/migrations/` | Ordered Postgres migrations for Supabase |
| `.env.example` | Safe env template — copy to `.env.local` |

Environment-specific secrets belong in `.env.local` (not committed). For UI-only smoke you can omit Supabase vars; middleware skips auth refresh until URL + anon/publishable key are present.

## Database (Supabase)

Courtbooka targets **Supabase Postgres** ([RONA-1048](/RONA/issues/RONA-1048)).

1. Copy `.env.example` → `.env.local` and fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). Optionally add `SUPABASE_SERVICE_ROLE_KEY` **only on the server** for admin/read-back tooling — never expose it via `NEXT_PUBLIC_*`.
2. Apply migrations in filename order (`supabase/migrations/`). Options:
   - Supabase Dashboard → SQL → paste each migration file; or
   - Supabase CLI linked to your project: `supabase db push` (see [CLI docs](https://supabase.com/docs/guides/cli)).
3. Seed demo rows (venue → court → slot): run `supabase/seed.sql` in the SQL editor. Inserts into `bookings` require an existing `auth.users` row — uncomment the sample block in that file once you have a user UUID.

### Row Level Security

All booking tables ship with **RLS enabled and no policies** (deny-by-default over PostgREST). The service role bypasses RLS for migrations and trusted server tasks only.

When auth UI lands, add explicit policies instead of widening defaults — for example:

```sql
-- Example only — do not run until requirements are clear
-- create policy "bookings_select_own"
--   on public.bookings for select to authenticated
--   using (auth.uid() = user_id);
```

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
