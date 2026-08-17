import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EmptyState, Page, SectionHeading } from "@/components/shared/Bits";
import { AthleteCard } from "@/components/athlete/AthleteCard";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved athletes | KheloLocal" },
      {
        name: "description",
        content: "Your shortlist of verified local athletes on KheloLocal.",
      },
      { property: "og:title", content: "Saved athletes | KheloLocal" },
      { property: "og:description", content: "Shortlisted talent, ready to contact." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { db } = useKhelo();
  const saved = db.athletes.filter((a) => db.savedAthletes.includes(a.id));

  return (
    <Page>
      <SectionHeading eyebrow="Shortlist" title="Saved athletes" />
      {saved.length === 0 ? (
        <EmptyState
          title="No saved athletes yet."
          description="Save athletes from discovery to build a shortlist."
          action={
            <Button asChild>
              <Link to="/discover">Discover talent</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((a) => (
            <AthleteCard key={a.id} athlete={a} />
          ))}
        </div>
      )}
    </Page>
  );
}