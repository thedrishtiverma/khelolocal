import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, MapPin, Trophy, Users } from "lucide-react";
import { Page, SectionHeading, Stat } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { SportIcon } from "@/components/shared/SportIcon";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/cities/indore")({
  head: () => ({
    meta: [
      { title: "Indore sports city | KheloLocal" },
      { name: "description", content: "Explore the people, places and sporting events of Indore." },
    ],
  }),
  component: IndorePage,
});

function IndorePage() {
  const { db } = useKhelo();
  const city = db.cities.find((item) => item.id === "indore");
  const sports = db.sports.slice(0, 6);
  const zones = db.zones.filter((item) => item.cityId === "indore");

  return (
    <div>
      <NetworkHero
        tone="community"
        eyebrow="KheloLocal / Indore"
        title={<>This is our <span className="text-lime">home ground.</span></>}
        description="Find the athletes, tournaments, institutions and everyday playing spaces that make Indore's sporting network move."
        highlights={["Local players", "Open grounds", "Live events"]}
        actions={<Link to="/map" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">Open the Indore map <ArrowRight className="size-4" /></Link>}
      />
      <Page className="py-14 sm:py-20">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat value={db.athletes.length} label="Athletes" />
          <Stat value={db.tournaments.length} label="Tournaments" />
          <Stat value={db.colleges.length} label="Institutions" />
          <Stat tone="accent" value={zones.length} label="City zones" />
        </div>
        <section className="mt-16">
          <SectionHeading eyebrow="The city network" title="Indore, mapped for sport." subtitle={`${city?.state ?? "Madhya Pradesh"} · Find what is happening close to you.`} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {zones.map((zone) => <Link key={zone.id} to="/map" className="data-card group rounded-xl p-5"><MapPin className="size-5 text-lime" /><h2 className="mt-8 font-display text-xl font-bold uppercase">{zone.name}</h2><p className="mt-2 text-sm text-muted-foreground">{zone.localities.join(" · ")}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold group-hover:text-lime">Focus zone <ArrowRight className="size-4" /></span></Link>)}
          </div>
        </section>
        <section className="mt-16">
          <SectionHeading eyebrow="Pick your game" title="Every sport has a local signal." action={<Link to="/sports" className="text-sm font-bold hover:text-lime">All sports <ArrowRight className="inline size-4" /></Link>} />
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {sports.map((sport) => <Link key={sport.id} to="/sports/$sport" params={{ sport: sport.id }} className="data-card-muted rounded-xl border border-border p-4 hover:border-lime"><SportIcon sportId={sport.id} className="size-6 text-lime" /><h2 className="mt-5 font-display text-lg font-bold uppercase">{sport.name}</h2></Link>)}
          </div>
        </section>
        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[{ icon: Trophy, title: "Find tournaments", body: "See what is open, live and coming up across Indore.", to: "/tournaments" as const }, { icon: Users, title: "Meet athletes", body: "Discover players by sport, position and verified experience.", to: "/athletes" as const }, { icon: Building2, title: "See institutions", body: "Follow the colleges and organizations building local sport.", to: "/institutions" as const }].map(({ icon: Icon, title, body, to }) => <Link key={title} to={to} className="data-card rounded-xl p-6"><Icon className="size-6 text-lime" /><h2 className="mt-8 font-display text-2xl font-bold uppercase">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p><ArrowRight className="mt-6 size-4 text-lime" /></Link>)}
        </section>
      </Page>
    </div>
  );
}