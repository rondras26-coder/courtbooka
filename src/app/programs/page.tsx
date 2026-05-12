import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs — Courtbooka",
  description: "Training programs and court blocks — coming soon.",
};

export default function ProgramsPage() {
  return (
    <div className="flex flex-1 flex-col px-6 py-10 md:mx-auto md:max-w-2xl md:py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Programs</h1>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        Training programs, coached blocks, and recurring reservations will ship
        here. This placeholder exists so navigation matches the IA baseline
        (RONA-1051 / RONA-1054).
      </p>
    </div>
  );
}
