import type { SVGProps } from "react";
import { KheloIcon, sportIconLabel, sportIconName } from "@/components/shared/KheloIcon";

export function SportIcon({
  sportId,
  ...props
}: Omit<SVGProps<SVGSVGElement>, "name"> & { sportId: string }) {
  const isDecorative = props["aria-hidden"] === true;
  return (
    <KheloIcon
      name={sportIconName(sportId)}
      aria-label={isDecorative ? undefined : (props["aria-label"] ?? sportIconLabel(sportId))}
      {...props}
    />
  );
}
