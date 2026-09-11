import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, Page, SectionHeading, Stat } from "@/components/shared/Bits";
import { AthleteCard } from "@/components/athlete/AthleteCard";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/scout")({
  head: () => ({ meta: [{ title: "Scout dashboard | KheloLocal" }] }),
  component: ScoutDashboard,
});

function ScoutDashboard() {
  const { db, currentUser } = useKhelo();
  const saved = db.athletes.filter((athlete) => db.savedAthletes.includes(athlete.id)).slice(0, 3);
  const verified = db.athletes.filter((athlete) => athlete.verificationStatus === "VERIFIED");

  if (!currentUser || currentUser.role !== "SCOUT") {
    return (
      <Page>
        <EmptyState
          title="Scout demo dashboard"
          description="Use the Scout / Coach / Team demo account to explore athlete discovery tools."
          action={
            <Button asChild>
              <Link to="/login">Open demo login</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  return (
    <Page className="py-10 sm:py-16">
      <section className="surface-panel rounded-2xl p-6 sm:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-foreground/60">
          Scout workspace
        </p>
        <h1 className="mt-2 font-display text-4xl font-black uppercase">Find the next player.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-surface-foreground/70">
          Search Indore's athlete network, compare verified records and build a shortlist for your
          team.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-5 border-t border-surface-foreground/15 pt-6 sm:grid-cols-3">
          <Stat tone="invert" value={verified.length} label="Verified athletes" />
          <Stat tone="invert" value={db.teams.length} label="Local teams" />
          <Stat tone="accent" value={saved.length} label="Shortlisted" />
        </div>
      </section>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/athletes">
            <Search className="size-4" /> Discover athletes
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/saved">
            <ShieldCheck className="size-4" /> Open shortlist
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/teams">
            <Users className="size-4" /> Browse teams
          </Link>
        </Button>
      </div>
      <section className="mt-12">
        <SectionHeading eyebrow="Your shortlist" title="Saved athlete profiles" />
        {saved.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {saved.map((athlete) => (
              <AthleteCard key={athlete.id} athlete={athlete} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your shortlist is empty"
            description="Save athletes from the discovery page to compare them here."
          />
        )}
      </section>
    </Page>
  );
}
