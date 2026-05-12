import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams — Courtbooka",
  description: "Team rosters and club management — coming soon.",
};

export default function TeamsPage() {
  return (
    <div className="flex flex-1 flex-col px-6 py-10 md:mx-auto md:max-w-2xl md:py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Teams</h1>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        Rosters, roles, and team booking will ship here — placeholder route for
        shared shell / IA alignment.
      </p>
    </div>
  );
}
