import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EmptyState, Initials, Page, SectionHeading } from "@/components/shared/Bits";
import { formatDate } from "@/lib/format";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/connections")({
  head: () => ({
    meta: [
      { title: "Connection requests | KheloLocal" },
      {
        name: "description",
        content: "Connection requests you have sent to athletes discovered on KheloLocal.",
      },
      { property: "og:title", content: "Connection requests | KheloLocal" },
      { property: "og:description", content: "Track outreach to local athletes." },
    ],
  }),
  component: ConnectionsPage,
});

function ConnectionsPage() {
  const { db } = useKhelo();

  return (
    <Page>
      <SectionHeading eyebrow="Outreach" title="Connection requests" />
      {db.connections.length === 0 ? (
        <EmptyState
          title="No requests sent yet."
          description="Open an athlete profile and request a connection to start a conversation."
          action={
            <Button asChild>
              <Link to="/discover">Discover talent</Link>
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {db.connections.map((c) => {
            const athlete = db.athletes.find((a) => a.id === c.athleteId);
            if (!athlete) return null;
            return (
              <li key={c.id} className="flex items-center gap-4 p-4">
                <Initials name={athlete.name} className="size-11" />
                <div className="flex-1">
                  <p className="font-semibold">{athlete.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Requested {formatDate(c.createdAt)} · {c.status}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/athletes/$id" params={{ id: athlete.id }}>
                    View profile
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </Page>
  );
}