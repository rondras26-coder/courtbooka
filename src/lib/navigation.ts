/**
 * Baseline information architecture — primary destinations exposed in the app shell.
 * Add sections here first, then introduce matching routes.
 *
 * Aligned with RONA-1051 (Book · Programs · Teams · Profile); placeholders ship until journeys exist.
 */
export const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/book", label: "Book" },
  { href: "/programs", label: "Programs" },
  { href: "/teams", label: "Teams" },
  { href: "/profile", label: "Profile" },
] as const;

export type PrimaryNavItem = (typeof primaryNav)[number];
