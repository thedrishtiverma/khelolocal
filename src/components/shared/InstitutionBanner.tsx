import { Building2, Trophy } from "lucide-react";
import type { College } from "@/types";

export function InstitutionBanner({ college }: { college: College }) {
  return (
    <article className="institution-banner rounded-2xl p-6 sm:p-8">
      <div className="relative z-10 flex items-start justify-between gap-4">
        <Building2 className="size-8 text-lime" />
        <span className="font-ui text-[10px] font-bold uppercase tracking-[0.18em] text-surface-foreground/70">Indore / institution</span>
      </div>
      <h2 className="relative z-10 mt-12 font-display text-3xl font-black uppercase">{college.shortName}</h2>
      <p className="relative z-10 mt-2 text-sm text-surface-foreground/75">{college.sportsEventName}</p>
      <div className="relative z-10 mt-6 flex items-center gap-2 text-xs font-semibold text-surface-foreground/70"><Trophy className="size-4 text-lime" /> Building a lasting sports record</div>
    </article>
  );
}