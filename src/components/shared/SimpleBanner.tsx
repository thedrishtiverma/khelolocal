import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SimpleBanner({
  label,
  icon,
  className,
}: {
  label: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("simple-banner", className)}>
      {icon ? <span className="simple-banner-mark">{icon}</span> : null}
      <span className="simple-banner-label">{label}</span>
    </div>
  );
}
