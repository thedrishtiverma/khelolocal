import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useKhelo, type Match } from "@/lib/services/store";
import { performancesOfMatch, teamById, teamRoster } from "@/lib/services/selectors";
import type { PerformanceDraft } from "@/lib/services/store";

export function MatchScoringDialog({
  match,
  open,
  onOpenChange,
}: {
  match: Match;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { db, saveMatch, finishMatch } = useKhelo();
  const isKabaddi = db.tournaments.find((t) => t.id === match.tournamentId)?.sportId === "kabaddi";
  const existing = performancesOfMatch(db, match.id);

  const roster = [
    ...teamRoster(db, match.teamAId).map((a) => ({ athlete: a, teamId: match.teamAId })),
    ...teamRoster(db, match.teamBId).map((a) => ({ athlete: a, teamId: match.teamBId })),
  ];

  const [scores, setScores] = useState({
    teamAScore: match.teamAScore,
    teamBScore: match.teamBScore,
  });
  const [perfs, setPerfs] = useState<Record<string, PerformanceDraft>>(() => {
    const out: Record<string, PerformanceDraft> = {};
    roster.forEach(({ athlete, teamId }) => {
      const prior = existing.find((p) => p.athleteId === athlete.id);
      out[athlete.id] = {
        athleteId: athlete.id,
        teamId,
        goals: prior?.goals ?? 0,
        assists: prior?.assists ?? 0,
        playerOfMatch: prior?.playerOfMatch ?? false,
        raidPoints: prior?.raidPoints ?? 0,
        tacklePoints: prior?.tacklePoints ?? 0,
      };
    });
    return out;
  });

  const update = (id: string, patch: Partial<PerformanceDraft>) =>
    setPerfs((p) => ({ ...p, [id]: { ...p[id]!, ...patch } }));

  const setPotm = (id: string) =>
    setPerfs((p) => {
      const next: Record<string, PerformanceDraft> = {};
      Object.entries(p).forEach(([key, value]) => {
        next[key] = { ...value, playerOfMatch: key === id ? !value.playerOfMatch : false };
      });
      return next;
    });

  const list = Object.values(perfs);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {teamById(db, match.teamAId)?.name} vs {teamById(db, match.teamBId)?.name}
          </DialogTitle>
          <DialogDescription>
            {match.round} · Match {match.matchNumber}. Enter the score and player performances.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="a">{teamById(db, match.teamAId)?.name}</Label>
            <Input
              id="a"
              type="number"
              min={0}
              value={scores.teamAScore}
              onChange={(e) => setScores((s) => ({ ...s, teamAScore: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="b">{teamById(db, match.teamBId)?.name}</Label>
            <Input
              id="b"
              type="number"
              min={0}
              value={scores.teamBScore}
              onChange={(e) => setScores((s) => ({ ...s, teamBScore: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className="mt-2 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Player performances
          </p>
          {roster.map(({ athlete, teamId }) => {
            const p = perfs[athlete.id]!;
            return (
              <div key={athlete.id} className="rounded-md border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{athlete.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {teamById(db, teamId)?.name} · {athlete.position}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold">
                    <Checkbox
                      checked={p.playerOfMatch}
                      onCheckedChange={() => setPotm(athlete.id)}
                    />
                    Player of the match
                  </label>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {isKabaddi ? (
                    <>
                      <NumField
                        label="Raid points"
                        value={p.raidPoints ?? 0}
                        onChange={(v) => update(athlete.id, { raidPoints: v })}
                      />
                      <NumField
                        label="Tackle points"
                        value={p.tacklePoints ?? 0}
                        onChange={(v) => update(athlete.id, { tacklePoints: v })}
                      />
                    </>
                  ) : (
                    <>
                      <NumField
                        label="Goals"
                        value={p.goals}
                        onChange={(v) => update(athlete.id, { goals: v })}
                      />
                      <NumField
                        label="Assists"
                        value={p.assists}
                        onChange={(v) => update(athlete.id, { assists: v })}
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              saveMatch(match.id, scores, list);
              toast.success("Progress saved");
              onOpenChange(false);
            }}
          >
            Save draft
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              finishMatch(match.id, scores, list);
              toast.success("Match completed", {
                description: "Now verify the result to publish athlete stats.",
              });
              onOpenChange(false);
            }}
          >
            Mark match complete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <Input type="number" min={0} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}