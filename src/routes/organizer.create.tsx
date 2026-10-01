import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, Page, PrototypeDataNotice } from "@/components/shared/Bits";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/organizer/create")({
  head: () => ({
    meta: [
      { title: "Create a tournament | KheloLocal" },
      {
        name: "description",
        content: "Publish a tournament and reach athletes across the network.",
      },
    ],
  }),
  component: CreateTournament,
});

function CreateTournament() {
  const { db, currentUser, createTournament } = useKhelo();
  const navigate = useNavigate();

  if (currentUser?.role !== "ORGANIZER") {
    return (
      <Page className="max-w-3xl py-16 sm:py-24">
        <EmptyState
          title="Create a tournament"
          description="Sign in or create an organizer account to publish and manage a tournament."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link to="/signup">Create organizer account</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/login">Log in</Link>
              </Button>
            </div>
          }
        />
      </Page>
    );
  }

  return (
    <Page className="max-w-3xl py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Organizer tools
        </p>
        <h1 className="mt-2 font-display text-3xl font-black">Create a tournament</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Publish the event details athletes need to decide whether to participate.
        </p>
        <PrototypeDataNotice
          className="mt-4"
          message="Prototype only: this tournament is saved in this browser and is not shared with other athletes or organizers."
        />
      </div>

      <form
        className="space-y-6 rounded-lg border border-border bg-card p-5 sm:p-7"
        onSubmit={(event) => {
          event.preventDefault();
          const values = new FormData(event.currentTarget);
          const startDate = String(values.get("startDate"));
          const endDate = String(values.get("endDate"));
          const registrationDeadline = String(values.get("registrationDeadline"));
          const today = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Kolkata",
          }).format(new Date());
          if (
            registrationDeadline < today ||
            startDate < today ||
            registrationDeadline > startDate ||
            startDate > endDate
          ) {
            toast.error("Check the dates", {
              description:
                "Start and registration dates must be today or later. Registration must close by the start date, and the end date must follow the start date.",
            });
            return;
          }

          const sportId = String(values.get("sportId"));
          const sport = db.sports.find((item) => item.id === sportId);
          if (!sport) {
            toast.error("Choose a sport");
            return;
          }

          try {
            const tournament = createTournament({
              name: String(values.get("name")).trim(),
              sportId,
              sportName: sport.name,
              venue: String(values.get("venue")).trim(),
              address: String(values.get("address")).trim(),
              startDate,
              endDate,
              registrationDeadline,
              ageCategory: String(values.get("ageCategory")),
              genderCategory: String(values.get("genderCategory")),
              format: String(values.get("format")),
              maxParticipants: Number(values.get("maxParticipants")),
              registrationFee: Number(values.get("registrationFee")),
              prizePool: Number(values.get("prizePool")),
              description: String(values.get("description")).trim(),
              status: "REGISTRATION_OPEN",
            });
            toast.success("Tournament created");
            navigate({ to: "/organizer/manage/$id", params: { id: tournament.id } });
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Couldn't create the tournament");
          }
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="tournament-name">Tournament name</Label>
          <Input id="tournament-name" name="name" required maxLength={100} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tournament-sport">Sport</Label>
            <select
              id="tournament-sport"
              name="sportId"
              required
              defaultValue={db.sports[0]?.id ?? ""}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {db.sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tournament-format">Format</Label>
            <select
              id="tournament-format"
              name="format"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option>Knockout</option>
              <option>League</option>
              <option>Round robin</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="tournament-start">Start date</Label>
            <Input id="tournament-start" name="startDate" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tournament-end">End date</Label>
            <Input id="tournament-end" name="endDate" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration-deadline">Registration closes</Label>
            <Input id="registration-deadline" name="registrationDeadline" type="date" required />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tournament-venue">Venue</Label>
            <Input id="tournament-venue" name="venue" required maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tournament-address">Address</Label>
            <Input id="tournament-address" name="address" required maxLength={200} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tournament-age">Age category</Label>
            <select
              id="tournament-age"
              name="ageCategory"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="U-17">U-17</option>
              <option value="U-19">U-19</option>
              <option value="OPEN">Open</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tournament-gender">Eligibility</Label>
            <select
              id="tournament-gender"
              name="genderCategory"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="MIXED">Mixed</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="max-participants">Participant limit</Label>
            <Input
              id="max-participants"
              name="maxParticipants"
              type="number"
              min="2"
              max="10000"
              defaultValue="16"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration-fee">Entry fee (INR)</Label>
            <Input
              id="registration-fee"
              name="registrationFee"
              type="number"
              min="0"
              defaultValue="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prize-pool">Prize pool (INR)</Label>
            <Input
              id="prize-pool"
              name="prizePool"
              type="number"
              min="0"
              defaultValue="0"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tournament-description">Description</Label>
          <Textarea id="tournament-description" name="description" rows={4} maxLength={1000} />
        </div>

        <Button type="submit" className="w-full sm:w-auto">
          Create tournament
        </Button>
      </form>
    </Page>
  );
}
