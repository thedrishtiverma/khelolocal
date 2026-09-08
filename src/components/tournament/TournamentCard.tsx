import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/Badges";
import { formatDateRange, formatINR } from "@/lib/format";
import { sportMotif } from "@/lib/sport-visuals";
import type { Tournament } from "@/types";

export function TournamentCard({
  tournament,
  footnote,
}: {
  tournament: Tournament;
  footnote?: string;
}) {
  const filled = tournament.maxParticipants
    ? Math.min(100, Math.round((tournament.currentParticipants / tournament.maxParticipants) * 100))
    : 0;

  return (
    <article
      className={`flex flex-col rounded-lg border border-border bg-card p-5 theme-fade transition-shadow hover:shadow-md ${sportMotif(tournament.sportId)}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-ui text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {tournament.sportName} · {tournament.ageCategory}
          </p>
          <h3 className="mt-1 font-display text-lg font-bold leading-tight">{tournament.name}</h3>
        </div>
        <StatusBadge status={tournament.status} />
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          <span className="truncate">
            {tournament.venue}, {tournament.cityName}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="size-4 shrink-0" />
          <span>{formatDateRange(tournament.startDate, tournament.endDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="size-4 shrink-0" />
          <span className="font-num text-sm font-medium">
            {tournament.currentParticipants} / {tournament.maxParticipants}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Trophy className="size-4 shrink-0" />
          <span className="font-num text-sm font-medium">{formatINR(tournament.prizePool)}</span>
        </div>
      </dl>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-muted-foreground font-ui">
          <span>Spots filled</span>
          <span className="font-num">{filled}%</span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={tournament.currentParticipants}
          aria-valuemin={0}
          aria-valuemax={tournament.maxParticipants}
          aria-label="Participation"
        >
          <div
            className={
              filled >= 100
                ? "h-full rounded-full bg-live transition-all"
                : "h-full rounded-full bg-verified transition-all"
            }
            style={{ width: `${Math.max(filled, 3)}%` }}
          />
        </div>
      </div>

      {footnote ? (
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-lime-foreground">
          {footnote}
        </p>
      ) : null}

      <p className="mt-2 text-xs text-muted-foreground">
        Organized by <span className="font-semibold text-foreground">{tournament.organizerName}</span>
      </p>

      <Button asChild className="mt-4" variant="secondary">
        <Link to="/tournaments/$id" params={{ id: tournament.id }}>
          View tournament
        </Link>
      </Button>
    </article>
  );
}