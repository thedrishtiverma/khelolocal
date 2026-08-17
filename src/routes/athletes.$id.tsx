import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState, Page } from "@/components/shared/Bits";
import { AthleteProfileView } from "@/components/athlete/AthleteProfileView";
import { athleteById, useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/athletes/$id")({
  head: () => ({
    meta: [
      { title: "Athlete profile | KheloLocal" },
      {
        name: "description",
        content:
          "A verified KheloLocal athlete profile: tournament record, match stats and organizer-verified achievements.",
      },
      { property: "og:title", content: "Athlete profile | KheloLocal" },
      { property: "og:description", content: "Verified local sporting record." },
    ],
  }),
  component: AthletePublicProfile,
});

function AthletePublicProfile() {
  const { id } = Route.useParams();
  const { db, currentUser, toggleSaveAthlete, requestConnection } = useKhelo();
  const athlete = athleteById(db, id);

  if (!athlete) {
    return (
      <Page>
        <EmptyState
          title="Athlete not found"
          action={
            <Button asChild>
              <Link to="/discover">Back to discovery</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  const saved = db.savedAthletes.includes(athlete.id);
  const connected = db.connections.some((c) => c.athleteId === athlete.id);
  const isScout = currentUser?.role === "SCOUT";

  return (
    <Page>
      <AthleteProfileView
        athlete={athlete}
        actions={
          isScout ? (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  toggleSaveAthlete(athlete.id);
                  toast.success(saved ? "Removed from saved" : "Athlete saved");
                }}
              >
                {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                {saved ? "Saved" : "Save athlete"}
              </Button>
              <Button
                onClick={() => {
                  requestConnection(athlete.id);
                  toast.success("Connection request sent", {
                    description: `${athlete.name} will see your interest.`,
                  });
                }}
                disabled={connected}
              >
                <Send className="size-4" />
                {connected ? "Request sent" : "Request connection"}
              </Button>
            </>
          ) : null
        }
      />
    </Page>
  );
}