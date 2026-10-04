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
type ArtifactKind =
  | "pulse"
  | "routes"
  | "radar"
  | "lineup"
  | "fixture"
  | "control"
  | "passport"
  | "field"
  | "vault"
  | "shortlist"
  | "report"
  | "map"
  | "expansion"
  | "poster"
  | "receipt"
  | "replay"
  | "journal"
  | "noticeboard"
  | "squad"
  | "openline"
  | "suggestions"
  | "kit";

const artifactByEyebrow: Record<string, ArtifactKind> = {
  "Started in Indore, Madhya Pradesh.": "pulse",
  "Explore KheloLocal": "routes",
  "Athlete discovery": "radar",
  "Team discovery": "lineup",
  "The local tournament calendar": "fixture",
  "For organizers": "control",
  "Sport × city": "passport",
  "For institutions": "vault",
  "For coaches and teams": "shortlist",
  "KheloLocal volunteers": "report",
  "Indore / live sports map": "map",
  "KheloLocal cities": "expansion",
  "KheloLocal / Indore": "poster",
  "Verified record": "receipt",
  "How KheloLocal works": "replay",
  "Demo tools": "replay",
  "Community / stories": "journal",
  "The people behind KheloLocal": "noticeboard",
  "Careers at KheloLocal": "squad",
  "Get in touch": "openline",
  "Help shape KheloLocal": "suggestions",
  "KheloLocal merch": "kit",
  "Our vision": "poster",
};

function Diagram({
  kind,
  highlights,
}: {
  kind: ArtifactKind;
  highlights: [string, string, string];
}) {
  const map = kind === "map" || kind === "expansion";
  return (
    <div className={cn("artifact-diagram", map && "artifact-map")}>
      {Array.from({ length: kind === "lineup" ? 11 : 8 }).map((_, i) => (
        <span key={i} className={cn("artifact-dot", i === 3 && "artifact-dot-active")} />
      ))}
      <div className="artifact-diagram-caption">
        {map ? "GAME SIGNALS NEAR YOU" : highlights.join(" · ")}
      </div>
    </div>
  );
}

function Paper({ kind, highlights }: { kind: ArtifactKind; highlights: [string, string, string] }) {
  const labels =
    kind === "receipt" ? ["RESULT LOGGED", "SOURCE CHECKED", "RECORD PUBLISHED"] : highlights;
  return (
    <div className="artifact-paper">
      <b>
        {kind === "fixture"
          ? "SAT / 06"
          : kind === "vault"
            ? "ARCHIVE 2026"
            : kind === "replay"
              ? "01 → 04"
              : "LOCAL SPORT"}
      </b>
      {labels.map((item, i) => (
        <div className="artifact-paper-row" key={item}>
          <span>0{i + 1}</span>
          <strong>{item}</strong>
          <i />
        </div>
      ))}
      <em>{kind === "receipt" ? "verified at the source" : "made for the local game"}</em>
    </div>
  );
}

function Routes({ highlights }: { highlights: [string, string, string] }) {
  return (
    <div className="artifact-routes">
      {[...highlights, "Explore"].map((item, i) => (
        <div key={item}>
          <span>0{i + 1}</span>
          {item}
          <b>↗</b>
        </div>
      ))}
    </div>
  );
}
function Shortlist({ highlights }: { highlights: [string, string, string] }) {
  return (
    <div className="artifact-notes">
      {highlights.map((item, i) => (
        <div key={item} style={{ transform: `rotate(${i - 1}deg)` }}>
          <small>SCOUT NOTE / 0{i + 1}</small>
          <b>{item}</b>
          <span>Local signal confirmed</span>
        </div>
      ))}
    </div>
  );
}
function Report({ highlights }: { highlights: [string, string, string] }) {
  return (
    <div className="artifact-report">
      <b>FIELD NOTE #024</b>
      <p>“The game is already happening. Help make it visible.”</p>
      {highlights.map((item) => (
        <span key={item}>✓ {item}</span>
      ))}
    </div>
  );
}
function Editorial({
  kind,
  highlights,
}: {
  kind: ArtifactKind;
  highlights: [string, string, string];
}) {
  return (
    <div className="artifact-editorial">
      <small>
        {kind === "journal" ? "ISSUE 01 / THE PEOPLE BEHIND THE SCORE" : "KHELOLOCAL / INDORE"}
      </small>
      <b>{kind === "journal" ? "THE LOCAL\nGAME" : "THIS IS\nHOME"}</b>
      <span>{highlights.join(" / ")}</span>
    </div>
  );
}
function Noticeboard({ highlights }: { highlights: [string, string, string] }) {
  return (
    <div className="artifact-noticeboard">
      {highlights.map((item) => (
        <div key={item}>
          <i>●</i>
          {item}
          <small>pinned by the team</small>
        </div>
      ))}
    </div>
  );
}
function Squad({ highlights }: { highlights: [string, string, string] }) {
  return (
    <div className="artifact-squad">
      {highlights.map((item, i) => (
        <div key={item}>
          <span>{String(i + 1).padStart(2, "0")}</span>
          <b>{item}</b>
          <i>OPEN</i>
        </div>
      ))}
    </div>
  );
}
function OpenLine({ highlights }: { highlights: [string, string, string] }) {
  return (
    <div className="artifact-openline">
      <b>
        YOUR MESSAGE
        <br />
        COULD START
        <br />A MATCH.
      </b>
      <span>{highlights.join(" · ")}</span>
      <i>→ SEND A SIGNAL</i>
    </div>
  );
}
function Suggestions({ highlights }: { highlights: [string, string, string] }) {
  return (
    <div className="artifact-suggestions">
      {highlights.map((item, i) => (
        <span key={item} style={{ transform: `rotate(${i * 3 - 3}deg)` }}>
          {item}
        </span>
      ))}
    </div>
  );
}
function Kit({ highlights }: { highlights: [string, string, string] }) {
  return (
    <div className="artifact-kit">
      <div>KL</div>
      <b>DROP 01</b>
      <span>{highlights.join(" / ")}</span>
    </div>
  );
}

function Artifact({
  kind,
  highlights,
}: {
  kind: ArtifactKind;
  highlights: [string, string, string];
}) {
  const title: Record<ArtifactKind, string> = {
    pulse: "INDORE PLAYS",
    routes: "CHOOSE A ROUTE",
    radar: "PLAYER RADAR",
    lineup: "STARTING XI",
    fixture: "FIXTURE BOARD",
    control: "MATCH CONTROL",
    passport: "SPORT PASSPORT",
    field: "LOCAL FIELD",
    vault: "RECORD VAULT",
    shortlist: "TALENT SHORTLIST",
    report: "GROUND REPORT",
    map: "NEIGHBOURHOOD MAP",
    expansion: "CITY BY CITY",
    poster: "HOME GROUND",
    receipt: "TRUST RECEIPT",
    replay: "MATCH REPLAY",
    journal: "SIDELINE JOURNAL",
    noticeboard: "CLUBHOUSE",
    squad: "OPEN SQUAD",
    openline: "OPEN LINE",
    suggestions: "IDEA WALL",
    kit: "MATCHDAY DROP",
  };
  const isDiagram = ["pulse", "radar", "lineup", "field", "map", "expansion"].includes(kind);
  const isPaper = ["fixture", "control", "vault", "receipt", "replay", "passport"].includes(kind);
  return (
    <aside
      className={cn("network-hero-artifact", `network-hero-artifact-${kind}`)}
      aria-label={title[kind]}
    >
      <div className="artifact-topline">
        <span>{title[kind]}</span>
        <i>{kind === "receipt" ? "PROOF / 01" : "LOCAL / LIVE"}</i>
      </div>
      {isDiagram ? <Diagram kind={kind} highlights={highlights} /> : null}
      {isPaper ? <Paper kind={kind} highlights={highlights} /> : null}
      {kind === "routes" ? <Routes highlights={highlights} /> : null}
      {kind === "shortlist" ? <Shortlist highlights={highlights} /> : null}
      {kind === "report" ? <Report highlights={highlights} /> : null}
      {["poster", "journal"].includes(kind) ? (
        <Editorial kind={kind} highlights={highlights} />
      ) : null}
      {kind === "noticeboard" ? <Noticeboard highlights={highlights} /> : null}
      {kind === "squad" ? <Squad highlights={highlights} /> : null}
      {kind === "openline" ? <OpenLine highlights={highlights} /> : null}
      {kind === "suggestions" ? <Suggestions highlights={highlights} /> : null}
      {kind === "kit" ? <Kit highlights={highlights} /> : null}
    </aside>
  );
}

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
  description: ReactNode;
  actions?: ReactNode;
  highlights: [string, string, string];
  tone: HeroTone;
}) {
  const artifact = artifactByEyebrow[eyebrow] ?? (eyebrow.endsWith("× Indore") ? "field" : "pulse");
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
        <div className="relative z-10 hidden lg:block">
          <Artifact kind={artifact} highlights={highlights} />
        </div>
      </div>
    </section>
  );
}
