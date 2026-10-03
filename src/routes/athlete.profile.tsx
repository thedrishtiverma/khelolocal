import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState, Page } from "@/components/shared/Bits";
import { AthleteProfileView } from "@/components/athlete/AthleteProfileView";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentAthlete, useKhelo } from "@/lib/services/store";

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
  const { currentUser, updateMyProfile } = useKhelo();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [sport, setSport] = useState("");
  const [position, setPosition] = useState("");
  const [bio, setBio] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public" | "network">("private");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setName(athlete?.name ?? currentUser.name);
    setPhone(currentUser.phone);
    setCity(athlete?.cityId ?? currentUser.cityId);
    setSport(athlete?.primarySport ?? "football");
    setPosition(athlete?.position ?? "");
    setBio(athlete?.bio ?? "");
  }, [athlete, currentUser]);

  if (!currentUser) {
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
      {athlete ? (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            This is exactly what scouts and coaches see when they open your profile.
          </p>
          <AthleteProfileView athlete={athlete} />
        </>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6">
          <h1 className="font-display text-3xl font-black">Your sporting profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete your details to make your KheloLocal account useful to organizers and scouts.
          </p>
        </div>
      )}

      <form
        className="mt-8 max-w-3xl space-y-5 rounded-xl border border-border bg-card p-6"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          try {
            await updateMyProfile({
              name,
              phone,
              cityId: city,
              area,
              primarySport: sport,
              position,
              bio,
              visibility,
            });
            toast.success("Profile saved");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to save your profile.");
          } finally {
            setSaving(false);
          }
        }}
      >
        <div>
          <h2 className="font-display text-xl font-black">Edit profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your changes are saved to your account.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="profile-name">Full name</Label><Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} required /></div>
          <div className="space-y-2"><Label htmlFor="profile-phone">Phone</Label><Input id="profile-phone" value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" /></div>
          <div className="space-y-2"><Label htmlFor="profile-city">City</Label><Input id="profile-city" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Indore" /></div>
          <div className="space-y-2"><Label htmlFor="profile-area">Area</Label><Input id="profile-area" value={area} onChange={(event) => setArea(event.target.value)} placeholder="Vijay Nagar" /></div>
          <div className="space-y-2"><Label htmlFor="profile-sport">Primary sport</Label><Input id="profile-sport" value={sport} onChange={(event) => setSport(event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="profile-position">Position</Label><Input id="profile-position" value={position} onChange={(event) => setPosition(event.target.value)} /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="profile-bio">About your game</Label><Textarea id="profile-bio" value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Your strengths, experience and goals" /></div>
        <div className="space-y-2">
          <Label htmlFor="profile-visibility">Profile visibility</Label>
          <select id="profile-visibility" value={visibility} onChange={(event) => setVisibility(event.target.value as typeof visibility)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            <option value="private">Private — only me and admins</option>
            <option value="network">Network — signed-in community</option>
            <option value="public">Public — visible in discovery</option>
          </select>
        </div>
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save profile"}</Button>
      </form>
    </Page>
  );
}
