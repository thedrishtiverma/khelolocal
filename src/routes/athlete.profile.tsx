import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EmptyState, Page } from "@/components/shared/Bits";
import { AthleteProfileView } from "@/components/athlete/AthleteProfileView";
import { useCurrentAthlete } from "@/lib/services/store";

export const Route = createFileRoute("/athlete/profile")({
  head: () => ({
    meta: [
      { title: "My athlete profile | KheloLocal" },
      {
        name: "description",
        content: "Your KheloLocal profile: verified stats, achievements and tournament history.",
      },
      { property: "og:title", content: "My athlete profile | KheloLocal" },
      { property: "og:description", content: "The profile scouts and coaches see." },
    ],
  }),
  component: MyProfile,
});

function MyProfile() {
  const athlete = useCurrentAthlete();

  if (!athlete) {
    return (
      <Page>
        <EmptyState
          title="No athlete profile"
          description="Log in with the athlete demo account to view this page."
          action={
            <Button asChild>
              <Link to="/login">Go to login</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  return (
    <Page>
      <p className="mb-4 text-sm text-muted-foreground">
        This is exactly what scouts and coaches see when they open your profile.
      </p>
      <AthleteProfileView athlete={athlete} />
    </Page>
  );
}