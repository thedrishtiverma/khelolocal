import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeroTone = "explore" | "organizers" | "tournaments" | "athletes";

export function NetworkHero({
  eyebrow,
  title,
  description,
  actions,
  highlights,
  tone,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  actions?: ReactNode;
  highlights: [string, string, string];
  tone: HeroTone;
}) {
  return (
    <section className={cn("network-hero", `network-hero-${tone}`)}>
      <div className="network-hero-grid" aria-hidden="true" />
      <div className="network-hero-orbit network-hero-orbit-one" aria-hidden="true" />
      <div className="network-hero-orbit network-hero-orbit-two" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16 lg:py-24">
        <div className="relative z-10">
          <p className="network-hero-eyebrow">{eyebrow}</p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-black uppercase leading-[0.88] tracking-tight sm:text-7xl lg:text-8xl">
            {title}
          </h1>
          <p className="network-hero-description mt-7 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8">
            {description}
          </p>
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        <div className="network-hero-console relative z-10 hidden overflow-hidden rounded-2xl p-5 sm:p-6 lg:block">
          <div className="network-hero-console-line" />
          <p className="network-hero-console-kicker relative text-[10px] font-bold uppercase tracking-[0.22em]">
            KheloLocal / Indore
          </p>
          <div className="relative mt-8 grid grid-cols-3 gap-3">
            {highlights.map((item, index) => (
              <div key={item} className="network-hero-node">
                <span className="font-num text-xs text-lime">0{index + 1}</span>
                <p className="network-hero-node-label mt-5 text-sm font-bold leading-tight">
                  {item}
                </p>
              </div>
            ))}
          </div>
          <p className="network-hero-console-copy relative mt-7 border-t border-current/15 pt-4 text-xs leading-5">
            Local sport, connected by a verified record.
          </p>
        </div>
      </div>
    </section>
  );
}
