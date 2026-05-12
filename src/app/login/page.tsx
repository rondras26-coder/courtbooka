import Link from "next/link";

import { Button } from "@/components/ui/button";

import { signInWithMagicLink } from "./actions";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const error = typeof sp.error === "string" ? sp.error : undefined;
  const sent = sp.sent === "1" || sp.sent === "true";
  const email =
    typeof sp.email === "string" ? sp.email : "";
  const next =
    typeof sp.next === "string" && sp.next.startsWith("/") && !sp.next.startsWith("//")
      ? sp.next
      : "/book";

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <main className="flex w-full max-w-md flex-col gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Magic link via email. You need an account on this Supabase project
            (sign-up is enabled in the dashboard or via your IdP).
          </p>
        </div>

        {error ? (
          <p
            className="border-destructive/40 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {sent ? (
          <p className="text-muted-foreground text-center text-sm leading-relaxed">
            Check <span className="text-foreground font-medium">{email}</span>{" "}
            for a sign-in link, then return here to book.
          </p>
        ) : (
          <form action={signInWithMagicLink} className="flex flex-col gap-4">
            <input type="hidden" name="next" value={next} />
            <div className="flex flex-col gap-2 text-left">
              <label
                htmlFor="email"
                className="text-foreground text-sm font-medium"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={email}
                placeholder="you@example.com"
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </div>
            <Button type="submit" className="w-full">
              Send magic link
            </Button>
          </form>
        )}

        <p className="text-center text-sm">
          <Link
            href="/book"
            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Back to booking
          </Link>
        </p>
      </main>
    </div>
  );
}
