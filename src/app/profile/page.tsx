import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profile — Courtbooka",
  description: "Account and preferences — baseline shell route.",
};

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex flex-1 flex-col px-6 py-10 md:mx-auto md:max-w-2xl md:py-14">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          Sign in and profile details will surface here once Supabase is
          configured. For now this route anchors IA only.
        </p>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-1 flex-col px-6 py-10 md:mx-auto md:max-w-2xl md:py-14">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          Sign in to view your account. Full preferences and history will follow
          in a later slice.
        </p>
        <Button asChild className="mt-6 w-fit" variant="secondary">
          <Link href="/login?next=%2Fprofile">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-10 md:mx-auto md:max-w-2xl md:py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        Signed in as{" "}
        <span className="text-foreground font-medium">
          {user.email ?? user.id}
        </span>
        . Settings, notifications, and booking history will expand here.
      </p>
    </div>
  );
}
