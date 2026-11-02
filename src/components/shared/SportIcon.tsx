import type { SVGProps } from "react";
import { KheloIcon } from "@/components/shared/KheloIcon";
import { sportIconLabel, sportIconName } from "@/components/shared/khelo-icon-registry";

export function SportIcon({
  sportId,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  ...props
}: Omit<SVGProps<SVGSVGElement>, "name"> & { sportId: string }) {
  return (
    <KheloIcon
      name={sportIconName(sportId)}
      {...props}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel ?? (ariaHidden === true ? undefined : sportIconLabel(sportId))}
    />
  );
}
