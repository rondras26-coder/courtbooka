import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="flex max-w-lg flex-col items-center gap-8 text-center">
        <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <BookOpen className="size-7" aria-hidden />
        </div>
        <div className="space-y-3">
          <h1 className="text-balance text-3xl font-semibold tracking-tight">
            Courtbooka
          </h1>
          <p className="text-muted-foreground text-pretty text-base leading-relaxed">
            Technical bootstrap baseline for the Courtbooka project: Next.js App
            Router, TypeScript, Tailwind CSS v4, and shadcn/ui with Lucide icons.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <a href="/book">Book a court</a>
          </Button>
          <Button variant="secondary" asChild>
            <a href="/login">Sign in</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://nextjs.org/docs" rel="noopener noreferrer">
              Next.js docs
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
