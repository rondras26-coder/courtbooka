"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";

import { bookSlot } from "./actions";

export function BookSlotForm({ slotId }: { slotId: string }) {
  const [state, action, pending] = useActionState(bookSlot, null);

  return (
    <form action={action} className="flex flex-col items-end gap-1">
      <input type="hidden" name="slotId" value={slotId} />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Booking…" : "Book"}
      </Button>
      {state && "error" in state && state.error ? (
        <span className="text-destructive max-w-[12rem] text-right text-xs leading-snug">
          {state.error}
        </span>
      ) : null}
      {state && "ok" in state && state.ok ? (
        <span className="text-muted-foreground text-xs">Booked</span>
      ) : null}
    </form>
  );
}
