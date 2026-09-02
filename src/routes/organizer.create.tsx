import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/organizer/create")({
  head: () => ({
    meta: [
      { title: "Create a tournament | KheloLocal" },
      {
        name: "description",
        content:
          "Publish a local tournament in minutes: venue, dates, categories, fees and prize pool.",
      },
      { property: "og:title", content: "Create a tournament | KheloLocal" },
      { property: "og:description", content: "Set up registrations and fixtures in minutes." },
    ],
  }),
  component: CreateTournament,
});

const today = new Date().toISOString().slice(0, 10);

function CreateTournament() {
  const { db, createTournament } = useKhelo();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    sportId: db.sports[0]?.id ?? "football",
    venue: "",
    address: "",
    startDate: today,
    endDate: today,
    registrationDeadline: today,
    ageCategory: "Open",
    genderCategory: "MALE",
    format: "KNOCKOUT",
    maxParticipants: 8,
    registrationFee: 0,
    prizePool: 0,
    description: "",
  });

  const set = (key: keyof typeof form, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <Page className="max-w-3xl">
      <SectionHeading
        eyebrow="New tournament"
        title="Create a tournament"
        subtitle="It goes live for registrations as soon as you publish."
      />
      <form
        className="space-y-6 rounded-xl border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const sport = db.sports.find((s) => s.id === form.sportId);
          const tournament = createTournament({
            ...form,
            sportName: sport?.name ?? "Football",
            maxParticipants: Number(form.maxParticipants),
            registrationFee: Number(form.registrationFee),
            prizePool: Number(form.prizePool),
            status: "REGISTRATION_OPEN",
          });
          toast.success("Tournament published", {
            description: "Registrations are now open.",
          });
          navigate({ to: "/organizer/manage/$id", params: { id: tournament.id } });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Tournament name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Indore Monsoon Football Cup"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sport">Sport</Label>
            <select
              id="sport"
              value={form.sportId}
              onChange={(e) => set("sportId", e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {db.sports.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <select
              id="format"
              value={form.format}
              onChange={(e) => set("format", e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="KNOCKOUT">Knockout</option>
              <option value="LEAGUE">League</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age category</Label>
            <select
              id="age"
              value={form.ageCategory}
              onChange={(e) => set("ageCategory", e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {["U14", "U16", "U18", "U21", "Open"].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender category</Label>
            <select
              id="gender"
              value={form.genderCategory}
              onChange={(e) => set("genderCategory", e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="MIXED">Mixed</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={form.venue}
              onChange={(e) => set("venue", e.target.value)}
              placeholder="Nehru Stadium"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Race Course Road, Indore"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="start">Start date</Label>
            <Input
              id="start"
              type="date"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end">End date</Label>
            <Input
              id="end"
              type="date"
              value={form.endDate}
              onChange={(e) => set("endDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Registration deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={form.registrationDeadline}
              onChange={(e) => set("registrationDeadline", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="max">Max teams</Label>
            <Input
              id="max"
              type="number"
              min={2}
              value={form.maxParticipants}
              onChange={(e) => set("maxParticipants", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fee">Entry fee (₹)</Label>
            <Input
              id="fee"
              type="number"
              min={0}
              value={form.registrationFee}
              onChange={(e) => set("registrationFee", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prize">Prize pool (₹)</Label>
            <Input
              id="prize"
              type="number"
              min={0}
              value={form.prizePool}
              onChange={(e) => set("prizePool", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Who should play, rules, timings…"
          />
        </div>

        <Button type="submit" className="w-full">
          Publish tournament
        </Button>
      </form>
    </Page>
  );
}
