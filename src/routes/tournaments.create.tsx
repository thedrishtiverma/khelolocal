import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, Page } from "@/components/shared/Bits";

export const Route = createFileRoute("/tournaments/create")({
  head: () => ({ meta: [{ title: "Create a tournament | KheloLocal" }, { name: "description", content: "Publish a local tournament and reach athletes across Indore." }] }),
  component: CreateTournamentBridge,
});

function CreateTournamentBridge() {
  return <Page className="max-w-3xl py-16 sm:py-24"><EmptyState title="Ready to put your tournament on the map?" description="Organizer tools help you publish the event, manage registrations, run fixtures and verify results." action={<Button asChild><Link to="/organizer/create">Open organizer tools <ArrowRight className="size-4" /></Link></Button>} /></Page>;
}
