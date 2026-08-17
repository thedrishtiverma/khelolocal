import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/Badges";
import { formatDateRange, formatINR } from "@/lib/format";
import type { Tournament } from "@/types";

export function TournamentCard({
  tournament,
  footnote,
}: {
  tournament: Tournament;
  footnote?: string;
}) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
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
          <span className="stat-num text-sm">
            {tournament.currentParticipants} / {tournament.maxParticipants}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Trophy className="size-4 shrink-0" />
          <span className="stat-num text-sm">{formatINR(tournament.prizePool)}</span>
        </div>
      </dl>

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