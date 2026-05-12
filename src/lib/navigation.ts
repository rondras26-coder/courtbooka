/**
 * Baseline information architecture — primary destinations exposed in the app shell.
 * Add sections here first, then introduce matching routes.
 */
export const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/book", label: "Book" },
] as const;

export type PrimaryNavItem = (typeof primaryNav)[number];
