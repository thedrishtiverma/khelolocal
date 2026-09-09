import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AthleteCard } from "@/components/athlete/AthleteCard";
import { EmptyState, Page, SectionHeading } from "@/components/shared/Bits";
import { Input } from "@/components/ui/input";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/athletes")({
  head: () => ({ meta: [{ title: "Athletes in Indore | KheloLocal" }, { name: "description", content: "Find verified athletes, institutions and sporting records around Indore." }] }),
  component: AthletesPage,
});

function AthletesPage() {
  const { db } = useKhelo();
  const [query, setQuery] = useState("");
  const results = useMemo(() => db.athletes.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.primarySport.toLowerCase().includes(query.toLowerCase()) || a.collegeName?.toLowerCase().includes(query.toLowerCase())), [db.athletes, query]);
  return <Page className="py-14 sm:py-24"><SectionHeading eyebrow="Athlete discovery" title="Find the players around you." subtitle="Search athletes, sports and institutions. Open a profile to see the record behind the player." /><div className="relative mt-10 max-w-2xl"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search athletes, sports, institutions..." className="h-12 pl-10" /></div><div className="mt-10">{results.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{results.map((a) => <AthleteCard key={a.id} athlete={a} />)}</div> : <EmptyState title="No athletes found" description="Try a different name, sport or institution." />}</div></Page>;
}
