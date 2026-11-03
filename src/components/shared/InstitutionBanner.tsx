import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { College } from "@/types";
import { ActivityIcon, RoleIcon } from "@/components/shared/KheloIcon";

export function InstitutionBanner({ college }: { college: College }) {
  return (
    <Link to="/college" className="institution-card data-card group block rounded-2xl p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <RoleIcon role="institution" className="size-8 text-lime" />
        <span className="font-ui text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Sports institution
        </span>
      </div>
      <div className="mt-8 flex items-center justify-between gap-4">
        <h2 className="font-display text-3xl font-black uppercase transition-colors group-hover:text-lime">
          {college.shortName}
        </h2>
        <ArrowUpRight
          className="size-7 text-lime transition-transform duration-200 group-hover:rotate-45"
          aria-hidden="true"
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{college.sportsEventName}</p>
      <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <ActivityIcon activity="achievement" className="size-4 text-lime" /> Building a lasting
        sports record
      </div>
    </Link>
  );
}
