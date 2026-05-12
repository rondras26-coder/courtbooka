"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type BookSlotState = { error?: string } | { ok: true } | null;

export async function bookSlot(
  _prev: BookSlotState,
  formData: FormData,
): Promise<BookSlotState> {
  const slotId = String(formData.get("slotId") ?? "").trim();
  if (!slotId) {
    return { error: "Missing slot" };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/book")}`);
  }

  const { error } = await supabase.from("bookings").insert({
    slot_id: slotId,
    user_id: user.id,
    status: "confirmed",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/book");
  return { ok: true };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/book");
  redirect("/book");
}
