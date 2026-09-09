import { Award, BadgeCheck, MapPin, Star, Trophy } from "lucide-react";
import { Stat } from "@/components/shared/Bits";
import { ProfileBanner } from "@/components/shared/ProfileBanner";
import { VerificationChip } from "@/components/shared/Badges";
import { formatDate, sportLabel } from "@/lib/format";
import { useKhelo } from "@/lib/services/store";
import { achievementsOfAthlete, publicRecordsOfAthlete } from "@/lib/services/selectors";
import { RecordCard } from "@/components/college/RecordCard";
import type { Athlete } from "@/types";
import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  TOURNAMENT_WIN: <Trophy className="size-4" />,
  RUNNER_UP: <Award className="size-4" />,
  PLAYER_OF_MATCH: <Star className="size-4" />,
  TOP_SCORER: <Trophy className="size-4" />,
  MATCH_PERFORMANCE: <Star className="size-4" />,
};

export function AthleteProfileView({
  athlete,
  actions,
}: {
  athlete: Athlete;
  actions?: ReactNode;
}) {
  const { db } = useKhelo();
  const achievements = achievementsOfAthlete(db, athlete.id);
  const collegeRecords = publicRecordsOfAthlete(db, athlete.id);
  const sportName = sportLabel(athlete.primarySport);

  return (
    <div className="space-y-8">
      <ProfileBanner
        name={athlete.name}
        image={athlete.profileImage}
        eyebrow={`${sportName} · ${athlete.ageCategory}`}
        subtitle={`${athlete.position || "Position not set"}${athlete.collegeName ? ` · ${athlete.collegeName}` : ""}`}
        meta={<span className="flex items-center gap-1.5"><MapPin className="size-4" />{athlete.cityName}</span>}
        status={<VerificationChip status={athlete.verificationStatus} />}
        actions={actions}
        accent={athlete.primarySport === "football" ? "field" : "accent"}
      />
      <section className="surface-panel rounded-xl p-6 sm:p-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat tone="invert" value={athlete.tournamentsPlayed} label="Tournaments" />
          <Stat tone="invert" value={athlete.matchesPlayed} label="Matches" />
          <Stat tone="invert" value={athlete.wins} label="Wins" />
          <Stat tone="accent" value={athlete.verifiedAchievementsCount} label="Verified" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-xl border border-border bg-card p-6">
          {collegeRecords.length ? (
            <div className="mb-8">
              <h2 className="font-display text-xl font-bold">College record (verified)</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Past annual sports event results confirmed by {athlete.collegeName ?? "the college"}{" "}
                and verified by KheloLocal.
              </p>
              <div className="mt-4 grid gap-4">
                {collegeRecords.map((r) => (
                  <RecordCard key={r.id} record={r} />
                ))}
              </div>
            </div>
          ) : null}
          <h2 className="font-display text-xl font-bold">Verified achievements</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every record below was confirmed by the tournament organizer.
          </p>
          {achievements.length === 0 ? (
            <p className="mt-6 rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No achievements yet. Play a tournament to start building a record.
            </p>
          ) : (
            <ol className="mt-6 space-y-4 border-l border-border pl-5">
              {achievements.map((a) => {
                const tournament = db.tournaments.find((t) => t.id === a.tournamentId);
                return (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[27px] top-1 flex size-4 items-center justify-center rounded-full bg-lime text-lime-foreground">
                      {ICONS[a.achievementType]}
                    </span>
                    <div className="rounded-md border border-border bg-background p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-display font-bold">{a.title}</p>
                        {a.verified ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-verified">
                            <BadgeCheck className="size-4" /> Verified
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">{tournament?.name}</p>
                      <p className="mt-1 text-sm">{a.description}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatDate(a.date)} · Verified by {a.verifiedBy}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold">Skills</h2>
            {athlete.skills.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {athlete.skills.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-sm font-semibold"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No skills added yet.</p>
            )}
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold">About</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {athlete.bio || "This athlete hasn't added a bio yet."}
            </p>
          </section>

          {athlete.primarySport === "football" ? (
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-bold">Season numbers</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Stat value={athlete.goals} label="Goals" />
                <Stat value={athlete.losses} label="Losses" />
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}