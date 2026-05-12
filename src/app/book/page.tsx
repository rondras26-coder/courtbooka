import Link from "next/link";

import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { BookSlotForm } from "./book-slot-form";

const timeFmt = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

type SlotRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  courts: {
    label: string;
    venues: { name: string; slug: string } | null;
  } | null;
};

type BookingRow = {
  id: string;
  created_at: string;
  court_slots: {
    id: string;
    starts_at: string;
    ends_at: string;
    courts: { label: string; venues: { name: string } | null } | null;
  } | null;
};

export default async function BookPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <main className="max-w-md space-y-3 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Book a court</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Configure{" "}
            <code className="text-foreground">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            and an anon key in{" "}
            <code className="text-foreground">.env.local</code> to load live
            slots.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </main>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const slotsPromise = supabase
    .from("court_slots")
    .select(
      "id, starts_at, ends_at, status, courts ( label, venues ( name, slug ) )",
    )
    .eq("status", "available")
    .order("starts_at", { ascending: true });

  const minePromise = user
    ? supabase
        .from("bookings")
        .select(
          "id, created_at, court_slots ( id, starts_at, ends_at, courts ( label, venues ( name ) ) )",
        )
        .order("created_at", { ascending: false })
    : Promise.resolve({
        data: null as unknown,
        error: null as null,
      });

  const [{ data: slots, error: slotsError }, { data: mine, error: mineErr }] =
    await Promise.all([slotsPromise, minePromise]);

  const slotList = (slots ?? []) as unknown as SlotRow[];
  const mineRows = (mine ?? []) as unknown as BookingRow[];

  return (
    <div className="flex flex-1 flex-col px-6 py-10 md:mx-auto md:max-w-3xl md:py-14">
      <header className="mb-10 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Book a court</h1>
        <p className="text-muted-foreground text-sm">
          Browse available slots, sign in from the header, and confirm a booking
          under RLS.
        </p>
      </header>

      {slotsError ? (
        <p className="text-destructive text-sm" role="alert">
          Could not load slots: {slotsError.message}
        </p>
      ) : null}
      {mineErr && user ? (
        <p className="text-destructive text-sm" role="alert">
          Could not load your bookings: {mineErr.message}
        </p>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Available slots</h2>
        {slotList.length === 0 ? (
          <p className="text-muted-foreground border-border bg-card rounded-lg border px-4 py-6 text-sm">
            No open slots. Seed{" "}
            <code className="text-foreground">supabase/seed.sql</code> or add
            rows in SQL.
          </p>
        ) : (
          <ul className="divide-border border-border bg-card divide-y rounded-lg border">
            {slotList.map((row) => {
              const venue = row.courts?.venues?.name ?? "Venue";
              const court = row.courts?.label ?? "Court";
              return (
                <li
                  key={row.id}
                  className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-foreground font-medium">
                      {venue} · {court}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {timeFmt.format(new Date(row.starts_at))} –{" "}
                      {timeFmt.format(new Date(row.ends_at))}
                      <span className="text-muted-foreground/80"> · Berlin</span>
                    </p>
                  </div>
                  {user ? (
                    <BookSlotForm slotId={row.id} />
                  ) : (
                    <Button asChild size="sm" variant="secondary">
                      <Link href="/login?next=%2Fbook">Sign in to book</Link>
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {user ? (
        <section className="mt-12 space-y-4">
          <h2 className="text-lg font-medium">Your bookings</h2>
          {mineRows.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              You have no bookings yet.
            </p>
          ) : (
            <ul className="divide-border border-border bg-card divide-y rounded-lg border">
              {mineRows.map((b) => {
                const slot = b.court_slots;
                if (!slot) return null;
                const v = slot.courts?.venues?.name ?? "Venue";
                const c = slot.courts?.label ?? "Court";
                return (
                  <li key={b.id} className="px-4 py-4">
                    <p className="text-foreground font-medium">
                      {v} · {c}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {timeFmt.format(new Date(slot.starts_at))} –{" "}
                      {timeFmt.format(new Date(slot.ends_at))}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
