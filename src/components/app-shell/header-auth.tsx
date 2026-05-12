import Link from "next/link";

import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

type HeaderAuthProps = {
  user: { email: string | null; id: string } | null;
};

export function HeaderAuth({ user }: HeaderAuthProps) {
  if (!user) {
    return (
      <Button asChild size="sm" variant="secondary">
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground hidden max-w-[12rem] truncate text-xs md:inline">
        {user.email ?? user.id}
      </span>
      <form action={signOut}>
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
