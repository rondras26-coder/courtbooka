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

Environment-specific secrets belong in `.env.local` (not committed). None are required for this bootstrap.

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
