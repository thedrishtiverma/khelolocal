import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeroTone =
  | "explore"
  | "organizers"
  | "tournaments"
  | "athletes"
  | "sports"
  | "institutions"
  | "volunteer"
  | "shop"
  | "community";
type Scene =
  | "city"
  | "trail"
  | "tunnel"
  | "formation"
  | "fixture"
  | "whistle"
  | "surface"
  | "legacy"
  | "spotlight"
  | "chalk"
  | "heatmap"
  | "india"
  | "poster"
  | "proof"
  | "journey"
  | "replay"
  | "stories"
  | "clubhouse"
  | "squad"
  | "signal"
  | "passback"
  | "kit"
  | "horizon";

const sceneByEyebrow: Record<string, Scene> = {
  "Started in Indore, Madhya Pradesh.": "city",
  "Explore KheloLocal": "trail",
  "Athlete discovery": "tunnel",
  "Team discovery": "formation",
  "Fixtures across your city": "fixture",
  "For organizers": "whistle",
  "Sport × city": "surface",
  "For institutions": "legacy",
  "For coaches and teams": "spotlight",
  "KheloLocal volunteers": "chalk",
  "Indore / live sports map": "heatmap",
  "KheloLocal cities": "india",
  "KheloLocal / Indore": "poster",
  "Verified record": "proof",
  "How KheloLocal works": "journey",
  "Demo tools": "replay",
  "Community / stories": "stories",
  "The people behind KheloLocal": "clubhouse",
  "Careers at KheloLocal": "squad",
  "Get in touch": "signal",
  "Help shape KheloLocal": "passback",
  "KheloLocal merch": "kit",
  "Our vision": "horizon",
};

const sceneWords: Record<Scene, string> = {
  city: "YOUR CITY PLAYS",
  trail: "FOLLOW THE NOISE",
  tunnel: "GAME ON",
  formation: "ONE SIDE",
  fixture: "FIRST WHISTLE",
  whistle: "START THE GAME",
  surface: "OWN THE SURFACE",
  legacy: "THE RECORD STAYS",
  spotlight: "SPOT POTENTIAL",
  chalk: "MARK THE GROUND",
  heatmap: "GAMES NEAR YOU",
  india: "CITY BY CITY",
  poster: "INDORE PLAYS",
  proof: "KNOW THE SOURCE",
  journey: "PLAY → PROVE → GROW",
  replay: "THE GAME TRAVELS",
  stories: "THE LOCAL GAME",
  clubhouse: "SHOW UP",
  squad: "JOIN THE SQUAD",
  signal: "SEND A SIGNAL",
  passback: "PASS IT BACK",
  kit: "WEAR THE BADGE",
  horizon: "THE LONG GAME",
};

function SportsAtmosphere({ scene }: { scene: Scene }) {
  const dots = scene === "formation" ? 11 : 8;
  return (
    <div className={cn("hero-atmosphere", `hero-scene-${scene}`)} aria-hidden="true">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="hero-floodlights">
        <i />
        <i />
        <i />
      </div>
      <div className="hero-motion" />
      <div className="hero-lines" />
      <div className="hero-dots">
        {Array.from({ length: dots }).map((_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="hero-scene-word">{sceneWords[scene]}</div>
      {scene === "city" || scene === "poster" ? (
        <div className="hero-skyline">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      ) : null}
      {scene === "fixture" ? (
        <div className="hero-fixture">
          <i>FRI / 18:30</i>
          <b>
            LOCAL
            <br />
            KICKOFF
          </b>
          <i>OPEN ENTRY</i>
        </div>
      ) : null}
      {scene === "stories" ? (
        <div className="hero-portraits">
          <i />
          <i />
          <i />
        </div>
      ) : null}
      {scene === "clubhouse" ? (
        <div className="hero-tape">
          <i>TEAM</i>
          <i>LOCAL</i>
          <i>SPORT</i>
        </div>
      ) : null}
      {scene === "squad" ? (
        <div className="hero-positions">
          <i>01</i>
          <i>02</i>
          <i>03</i>
          <i>04</i>
        </div>
      ) : null}
    </div>
  );
}

export function NetworkHero({
  eyebrow,
  title,
  description,
  actions,
  highlights: _highlights,
  tone,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  highlights: [string, string, string];
  tone: HeroTone;
}) {
  const scene = sceneByEyebrow[eyebrow] ?? (eyebrow.endsWith("× Indore") ? "surface" : "city");
  return (
    <section className={cn("network-hero", `network-hero-${tone}`)}>
      <SportsAtmosphere scene={scene} />
      <div className="network-hero-grid" aria-hidden="true" />
      <div className="network-hero-orbit network-hero-orbit-one" aria-hidden="true" />
      <div className="network-hero-orbit network-hero-orbit-two" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="max-w-4xl">
          <p className="network-hero-eyebrow">{eyebrow}</p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-black uppercase leading-[0.88] tracking-tight sm:text-7xl lg:text-8xl">
            {title}
          </h1>
          <p className="network-hero-description mt-7 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8">
            {description}
          </p>
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
