import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/profile/setup")({
  head: () => ({ meta: [{ title: "Set up your profile | KheloLocal" }] }),
  component: ProfileSetupPage,
});

const copyByRole = {
  ATHLETE: {
    eyebrow: "Your sporting identity",
    title: "Show up as a player.",
    description: "These details help the right tournaments, teams and coaches find your game.",
    name: "Full name",
    detail: "Primary sport",
    detailPlaceholder: "Football, kabaddi, badminton…",
    extra: "Position or playing role",
    extraPlaceholder: "Forward, raider, all-rounder…",
    bio: "Your game in a few words",
  },
  ORGANIZER: {
    eyebrow: "Your organizer profile",
    title: "Give your fixtures a home.",
    description: "A clear organizer profile helps players know who is behind an event.",
    name: "Organization name",
    detail: "What do you organize?",
    detailPlaceholder: "Football cups, college leagues…",
    extra: "Phone for participants",
    extraPlaceholder: "Optional contact number",
    bio: "Tell players what your organization runs",
  },
  COLLEGE: {
    eyebrow: "Your institution profile",
    title: "Put your sports cell on record.",
    description: "Start with the details students and athletes need to recognise your institution.",
    name: "Institution name",
    detail: "Sports event or programme",
    detailPlaceholder: "Annual sports meet, varsity programme…",
    extra: "Sports cell contact",
    extraPlaceholder: "Optional contact number",
    bio: "What does sport look like at your institution?",
  },
  VOLUNTEER: {
    eyebrow: "Your local signal",
    title: "Start from your neighbourhood.",
    description: "Tell us where you know the grounds, courts and people who make sport happen.",
    name: "Your name",
    detail: "Area you know best",
    detailPlaceholder: "Vijay Nagar, Rau, Palasia…",
    extra: "How can you help?",
    extraPlaceholder: "Venue mapping, local fixtures…",
    bio: "A little about your local sports connection",
  },
  SCOUT: {
    eyebrow: "Your discovery profile",
    title: "Know who you are looking for.",
    description: "A little context helps us make athlete discovery more useful for you.",
    name: "Your name or team name",
    detail: "Sport or talent focus",
    detailPlaceholder: "U-19 football, kabaddi…",
    extra: "Area you are scouting",
    extraPlaceholder: "Indore, Madhya Pradesh…",
    bio: "What kind of player or team are you hoping to find?",
  },
  ADMIN: {
    eyebrow: "Platform profile",
    title: "Your account is ready.",
    description:
      "Administrators do not need a public profile. Continue to the operations workspace.",
    name: "Name",
    detail: "",
    detailPlaceholder: "",
    extra: "",
    extraPlaceholder: "",
    bio: "",
  },
} as const;

function homeFor(role: keyof typeof copyByRole) {
  return role === "ATHLETE"
    ? "/athlete"
    : role === "ORGANIZER"
      ? "/organizer"
      : role === "COLLEGE"
        ? "/college"
        : role === "VOLUNTEER"
          ? "/volunteer"
          : role === "SCOUT"
            ? "/scout"
            : "/admin";
}

function ProfileSetupPage() {
  const { currentUser, db, updateMyProfile } = useKhelo();
  const navigate = useNavigate();
  const role = currentUser?.role ?? "ATHLETE";
  const copy = copyByRole[role];
  const [name, setName] = useState(currentUser?.name ?? "");
  const [city, setCity] = useState(currentUser?.cityId || db.cities[0]?.id || "");
  const [area, setArea] = useState("");
  const [detail, setDetail] = useState("");
  const [extra, setExtra] = useState("");
  const [bio, setBio] = useState("");
  const [visibility, setVisibility] = useState<"private" | "network" | "public">("network");
  const [saving, setSaving] = useState(false);

  if (!currentUser)
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <p className="text-sm text-muted-foreground">Log in to set up your profile.</p>
        <Link to="/login" className="mt-4 inline-block font-semibold hover:underline">
          Go to login
        </Link>
      </div>
    );
  if (role === "ADMIN")
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <p className="text-sm text-muted-foreground">
          Administrator profiles are managed from the workspace.
        </p>
        <Link to="/admin" className="mt-4 inline-block font-semibold hover:underline">
          Open admin workspace
        </Link>
      </div>
    );

  const submit = async () => {
    if (!name.trim() || !city) return toast.error("Add your name and city to continue.");
    if (role === "ATHLETE" && !detail.trim())
      return toast.error("Choose your primary sport to continue.");
    setSaving(true);
    try {
      await updateMyProfile({
        name,
        cityId: city,
        area: role === "VOLUNTEER" ? detail : area || extra,
        phone: role === "ORGANIZER" || role === "COLLEGE" ? extra : undefined,
        primarySport: role === "ATHLETE" ? detail : undefined,
        position: role === "ATHLETE" ? extra : undefined,
        bio: role === "ATHLETE" ? bio : [detail, bio].filter(Boolean).join(" · "),
        visibility: role === "ATHLETE" ? visibility : "network",
      });
      localStorage.setItem(`khelolocal.profile-ready.${currentUser.id}`, "1");
      toast.success("Profile ready");
      navigate({ to: homeFor(role) });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-14 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-muted-foreground">
        {copy.eyebrow}
      </p>
      <h1 className="mt-3 font-display text-4xl font-black uppercase leading-none">{copy.title}</h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{copy.description}</p>
      <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-2/3 bg-lime" />
      </div>
      <form
        className="mt-8 space-y-5 rounded-xl border border-border bg-card p-6 sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="setup-name">{copy.name}</Label>
            <Input
              id="setup-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="setup-city">City</Label>
            <select
              id="setup-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Choose city</option>
              {db.cities
                .filter((item) => item.active)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="setup-detail">{copy.detail}</Label>
            <Input
              id="setup-detail"
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
              placeholder={copy.detailPlaceholder}
              required={role === "ATHLETE"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="setup-extra">{copy.extra}</Label>
            <Input
              id="setup-extra"
              value={extra}
              onChange={(event) => setExtra(event.target.value)}
              placeholder={copy.extraPlaceholder}
            />
          </div>
        </div>
        {role === "ATHLETE" ? (
          <div className="space-y-2">
            <Label htmlFor="setup-area">Your area</Label>
            <Input
              id="setup-area"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              placeholder="Vijay Nagar, Rau, Palasia…"
            />
          </div>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="setup-bio">{copy.bio}</Label>
          <Textarea
            id="setup-bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Optional, but useful"
          />
        </div>
        {role === "ATHLETE" ? (
          <div className="space-y-2">
            <Label htmlFor="setup-visibility">Who can discover you?</Label>
            <select
              id="setup-visibility"
              value={visibility}
              onChange={(event) => setVisibility(event.target.value as typeof visibility)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="network">KheloLocal community</option>
              <option value="public">Anyone browsing KheloLocal</option>
              <option value="private">Only me and admins</option>
            </select>
          </div>
        ) : null}
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Saving your profile…" : "Continue to my workspace"}
        </Button>
      </form>
    </div>
  );
}
