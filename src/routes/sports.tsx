import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Trophy } from "lucide-react";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/sports")({
  head: () => ({ meta: [{ title: "Sports in Indore | KheloLocal" }, { name: "description", content: "Find your sport, local tournaments, athletes and sporting communities in Indore." }] }),
  component: SportsPage,
});

function SportsPage() {
  const { db } = useKhelo();
  return <Page className="py-14 sm:py-24"><SectionHeading eyebrow="Sport × city" title="Find your sport. Find your people." subtitle="Choose a sport to discover the tournaments, athletes and communities building it in Indore." /><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{db.sports.map((sport) => <Link key={sport.id} to="/tournaments" className="data-card group rounded-2xl p-6"><Trophy className="size-7 text-lime" /><h2 className="mt-10 font-display text-2xl font-black uppercase">{sport.name}</h2><p className="mt-2 text-sm text-muted-foreground">Tournaments and athletes in Indore</p><span className="mt-7 inline-flex items-center gap-2 text-sm font-bold group-hover:text-lime">Explore <ArrowRight className="size-4" /></span></Link>)}</div></Page>;
}
