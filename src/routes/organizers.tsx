import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Megaphone, Pencil, Trophy } from "lucide-react";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/organizers")({
  head: () => ({ meta: [{ title: "For organizers | KheloLocal" }, { name: "description", content: "Publish tournaments, reach players and build a verified record with KheloLocal." }] }),
  component: OrganizersPage,
});

function OrganizersPage() {
  return <div><section className="surface-panel"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"><p className="text-[11px] font-bold uppercase tracking-[0.22em] text-lime">For organizers</p><h1 className="mt-5 max-w-4xl font-display text-5xl font-black uppercase leading-[0.9] sm:text-8xl">Run your tournament. Reach your players. Build its record.</h1><p className="mt-8 max-w-2xl text-lg leading-8 text-surface-foreground/70">KheloLocal helps local organizers publish tournaments, reach relevant athletes, manage participation and preserve verified results.</p><div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/tournaments/create">Create a tournament</Link></Button><Button asChild size="lg" variant="outline" className="border-surface-foreground/25 bg-transparent text-surface-foreground"><Link to="/contact">Talk to KheloLocal</Link></Button></div></div></section><Page className="py-14 sm:py-24"><SectionHeading eyebrow="One workflow" title="From announcement to sporting record." /><div className="grid gap-5 md:grid-cols-4">{[{ icon: Pencil, title: "Publish", body: "Create and promote your tournament." }, { icon: Megaphone, title: "Reach", body: "Get discovered by relevant athletes and teams." }, { icon: Trophy, title: "Manage", body: "Keep participants, schedules and information organized." }, { icon: BadgeCheck, title: "Record", body: "Turn results into verified sporting achievements." }].map(({ icon: Icon, title, body }) => <article key={title} className="data-card rounded-xl border-t-2 border-lime p-6"><Icon className="size-6 text-lime" /><h2 className="mt-8 font-display text-2xl font-bold uppercase">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p></article>)}</div></Page></div>;
}
