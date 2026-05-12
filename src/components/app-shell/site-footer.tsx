import Link from "next/link";

import { primaryNav } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="border-border mt-auto border-t py-8">
      <div className="text-muted-foreground mx-auto max-w-5xl space-y-4 px-4 text-xs leading-relaxed sm:px-6">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
          aria-label="Footer"
        >
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="text-center">
          Courtbooka — book courts with clear availability and sign-in.
        </p>
      </div>
    </footer>
  );
}
