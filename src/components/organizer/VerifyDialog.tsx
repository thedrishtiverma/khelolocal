import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useKhelo, type Match } from "@/lib/services/store";
import { matchLabel } from "@/lib/services/selectors";
import type { VerifyOutcome } from "@/lib/services/store";

export function VerifyDialog({
  match,
  open,
  onOpenChange,
}: {
  match: Match;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { db, verifyMatch } = useKhelo();
  const [note, setNote] = useState("");
  const [outcome, setOutcome] = useState<VerifyOutcome | null>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setOutcome(null);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        {outcome ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display">
                <BadgeCheck className="size-5 text-verified" />
                Result verified
              </DialogTitle>
              <DialogDescription>
                These athlete profiles were updated instantly — this is the data loop that makes
                talent discoverable.
              </DialogDescription>
            </DialogHeader>
            <ul className="space-y-3">
              {outcome.updatedAthletes.map((a) => (
                <li key={a.name} className="rounded-md border border-border p-3 text-sm">
                  <p className="font-semibold">{a.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground line-through">{a.before}</p>
                  <p className="text-xs font-semibold text-verified">{a.after}</p>
                </li>
              ))}
            </ul>
            {outcome.achievements.length > 0 ? (
              <div className="rounded-md border border-lime/40 bg-lime/10 p-3">
                <p className="text-xs font-bold uppercase tracking-widest">New achievements</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {outcome.achievements.map((a) => (
                    <li key={a.id}>
                      {a.title} — {a.description}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <Button onClick={() => onOpenChange(false)}>Done</Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">Verify this result</DialogTitle>
              <DialogDescription>
                {matchLabel(db, match)} · {match.teamAScore}–{match.teamBScore}. Verification is
                permanent and publishes verified stats to athlete profiles.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note (e.g. scoresheet checked by referee)"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  const result = verifyMatch(match.id, note);
                  if (!result) {
                    toast.error("Couldn't verify this match");
                    return;
                  }
                  setOutcome(result);
                  toast.success("Result verified and published");
                }}
              >
                <BadgeCheck className="size-4" />
                Verify result
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
