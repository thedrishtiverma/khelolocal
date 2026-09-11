import {
  Activity,
  CircleDot,
  Dumbbell,
  Goal,
  Hand,
  PersonStanding,
  Swords,
  Target,
  Table2,
  Volleyball,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

const ICONS: Record<string, LucideIcon> = {
  cricket: CircleDot,
  football: Goal,
  volleyball: Volleyball,
  kabaddi: Hand,
  badminton: Target,
  boxing: Swords,
  basketball: CircleDot,
  "table-tennis": Table2,
  tennis: Target,
  athletics: PersonStanding,
  "kho-kho": Activity,
  khokho: Activity,
  yoga: Dumbbell,
};

export function SportIcon({ sportId, ...props }: { sportId: string } & ComponentProps<LucideIcon>) {
  const Icon = ICONS[sportId] ?? Activity;
  return <Icon {...props} />;
}