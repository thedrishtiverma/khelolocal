import type { ReactNode } from "react";
import { BadgeCheck, Building2, MapPin } from "lucide-react";
import { Initials } from "@/components/shared/Bits";
import type { Organizer } from "@/types";

export function OrganizerBanner({
  organizer,
  actions,
  sport,
  eventName,
}: {
  organizer: Organizer;
  actions?: ReactNode;
  sport?: string;
  eventName?: string;
}) {
  return (
    <section
      className={`organizer-banner profile-banner-sport-${sport ?? "organizer"} overflow-hidden rounded-xl border border-border bg-card`}
    >
      <div className="organizer-banner-art relative min-h-24 overflow-hidden px-5 py-5 sm:px-6">
        <div className="profile-banner-lines absolute inset-0" />
        <p className="relative z-10 inline-flex rounded-full border border-white/20 bg-surface/70 px-2.5 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.18em] text-surface-foreground">
          {eventName ?? (sport ? `${sport} organizer` : "Tournament organizer")}
        </p>
      </div>
      <div className="relative px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="-mt-8 flex flex-col gap-4 sm:-mt-9 sm:flex-row sm:items-end">
          {organizer.logo ? (
            <img
              src={organizer.logo}
              alt={`${organizer.organizationName} logo`}
              className="profile-banner-avatar size-16 rounded-xl border-4 object-cover shadow-lg sm:size-18"
            />
          ) : (
            <Initials
              name={organizer.organizationName}
              className="profile-banner-avatar size-16 rounded-xl border-4 bg-lime text-xl text-lime-foreground shadow-lg sm:size-18"
            />
          )}
          <div className="min-w-0 flex-1 pb-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-black leading-none">
                {organizer.organizationName}
              </h2>
              {organizer.verificationStatus === "VERIFIED" ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-verified/30 bg-verified/10 px-2 py-1 text-xs font-semibold text-verified">
                  <BadgeCheck className="size-3.5" /> Verified organizer
                </span>
              ) : null}
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Building2 className="size-3.5" /> {organizer.organizationType}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" /> {organizer.cityName}
              </span>
            </p>
          </div>
          {actions ? <div className="flex flex-wrap gap-2 sm:pb-1">{actions}</div> : null}
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{organizer.description}</p>
      </div>
    </section>
  );
}
