import Link from "next/link";
import { BookOpen } from "lucide-react";

import { HeaderAuth } from "@/components/app-shell/header-auth";
import { MainNav } from "@/components/app-shell/main-nav";
import { MobileNav } from "@/components/app-shell/mobile-nav";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  let user: { email: string | null; id: string } | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      if (u) {
        user = { email: u.email ?? null, id: u.id };
      }
    } catch {
      // Misconfigured env in dev — still render shell without session.
    }
  }

  return (
    <header className="border-border bg-background/85 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="text-foreground flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg shadow-sm">
            <BookOpen className="size-4" aria-hidden />
          </span>
          <span className="hidden sm:inline">Courtbooka</span>
        </Link>
        <div className="hidden sm:flex sm:flex-1 sm:justify-center">
          <MainNav />
        </div>
        <div className="ml-auto flex min-w-0 items-center justify-end gap-1">
          <div className="sm:hidden">
            <MobileNav />
          </div>
          <HeaderAuth user={user} />
        </div>
      </div>
    </header>
  );
}
