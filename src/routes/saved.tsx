import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EmptyState, Page, SectionHeading } from "@/components/shared/Bits";
import { AthleteCard } from "@/components/athlete/AthleteCard";
import { useKhelo } from "@/lib/services/store";
import { canViewProfile } from "@/lib/services/relationships";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved athletes | KheloLocal" },
      {
        name: "description",
        content: "Your private shortlist of local profiles on KheloLocal.",
      },
      { property: "og:title", content: "Saved athletes | KheloLocal" },
      { property: "og:description", content: "Your private profile shortlist." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { db, currentUser } = useKhelo();
  const savedIds = new Set(
    (db.savedProfiles ?? [])
      .filter((item) => item.profileId === currentUser?.id)
      .map((item) => item.targetProfileId),
  );
  const saved = db.athletes.filter(
    (athlete) =>
      savedIds.has(athlete.userId) && canViewProfile(db, currentUser?.id ?? null, athlete.userId),
  );

  if (isSupabaseConfigured()) {
    return (
      <Page>
        <SectionHeading compact eyebrow="Shortlist" title="Saved profiles" />
        <EmptyState
          title="Saved profiles are temporarily unavailable"
          description="Persistent relationships will be enabled after the hosted database schema is confirmed."
        />
      </Page>
    );
  }

  return (
    <Page>
      <SectionHeading compact eyebrow="Shortlist" title="Saved profiles" />
      {saved.length === 0 ? (
        <EmptyState
          title="No saved athletes yet."
          description="Save public athlete profiles to build a private shortlist."
          action={
            <Button asChild>
              <Link to="/athletes">Discover talent</Link>
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
