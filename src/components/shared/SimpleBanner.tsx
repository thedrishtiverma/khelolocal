import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SimpleBannerTone =
  | "default"
  | "athlete"
  | "organizer"
  | "institution"
  | "volunteer"
  | "admin"
  | "sport"
  | "community";

const TONE_CLASSNAMES: Record<SimpleBannerTone, string> = {
  default: "simple-banner--default",
  athlete: "simple-banner--athlete",
  organizer: "simple-banner--organizer",
  institution: "simple-banner--institution",
  volunteer: "simple-banner--volunteer",
  admin: "simple-banner--admin",
  sport: "simple-banner--sport",
  community: "simple-banner--community",
};

export function SimpleBanner({
  label,
  icon,
  className,
  tone = "default",
}: {
  label: string;
  icon?: ReactNode;
  className?: string;
  tone?: SimpleBannerTone;
}) {
  return (
    <div className={cn("simple-banner", TONE_CLASSNAMES[tone], className)}>
      {icon ? <span className="simple-banner-mark">{icon}</span> : null}
      <span className="simple-banner-label">{label}</span>
    </div>
  );
}
