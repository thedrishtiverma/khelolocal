import { Link } from "@tanstack/react-router";
import { ArrowRight, RotateCcw } from "lucide-react";

type KheloErrorPageProps = {
  code: "404" | "500";
  embedded?: boolean;
  onRetry?: () => void;
};

const ERROR_COPY = {
  "404": {
    eyebrow: "ROUTE STATUS / 404",
    heading: "This page went out of bounds.",
    description:
      "Looks like this link missed the mark. The page may have moved, or it was never part of the fixture.",
  },
  "500": {
    eyebrow: "MATCH STATUS / 500",
    heading: "The match is paused.",
    description:
      "Something interrupted the play on our side. Give it another try, or head back to the local game.",
  },
} as const;

export function KheloErrorPage({ code, embedded = false, onRetry }: KheloErrorPageProps) {
  const copy = ERROR_COPY[code];
  const Page = embedded ? "div" : "main";

  return (
    <Page
      className={`kl-error-page flex flex-col bg-background text-foreground ${embedded ? "" : "min-h-screen px-5 py-6 sm:px-8 sm:py-8"}`}
    >
      {!embedded && (
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3" aria-label="KheloLocal home">
            <img
              src="/android-chrome-192x192.png"
              alt=""
              className="size-10 rounded-full ring-2 ring-lime/50"
              width={40}
              height={40}
            />
            <span className="font-display text-xl font-black tracking-tight">
              Khelo<span className="text-lime">Local</span>
            </span>
          </Link>
          <span className="hidden text-right font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:block">
            Indore, India
            <br />
            Play local. Prove your game.
          </span>
        </header>
      )}

      <section
        aria-labelledby="khelo-error-heading"
        className={`mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16 ${embedded ? "px-4 py-12 sm:px-6 md:py-16" : "flex-1 py-14 md:py-20"}`}
      >
        <div className="kl-error-field relative mx-auto flex aspect-square w-full max-w-[31rem] items-center justify-center overflow-hidden rounded-[2rem] bg-surface text-surface-foreground shadow-2xl">
          <div
            aria-hidden="true"
            className="absolute inset-5 rounded-[1.5rem] border border-surface-foreground/15"
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-5 bottom-5 border-l border-dashed border-surface-foreground/20"
          />
          <div
            aria-hidden="true"
            className="absolute left-5 right-5 top-1/2 border-t border-dashed border-surface-foreground/20"
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-surface-foreground/20 sm:size-40"
          />
          <div className="relative z-10 text-center">
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.24em] text-surface-foreground">
              KheloLocal / {code}
            </p>
            <p
              aria-hidden="true"
              className="font-display text-[clamp(8rem,28vw,15rem)] font-black leading-[0.85] tracking-[-0.09em] text-lime"
            >
              {code}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-surface-foreground/20 bg-surface-foreground/10 px-4 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em]">
              <span className="size-2 rounded-full bg-lime" />
              {code === "404" ? "No fixture found" : "Play paused"}
            </span>
          </div>
          <span
            aria-hidden="true"
            className="absolute -right-7 top-8 rotate-12 border-2 border-lime px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-lime sm:right-8"
          >
            {code === "404" ? "Out of bounds" : "Time out"}
          </span>
          <span
            aria-hidden="true"
            className="absolute bottom-5 left-7 font-mono text-[0.6rem] font-bold uppercase tracking-[0.18em] text-surface-foreground/55"
          >
            Grassroots sport / Est. Indore
          </span>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <p className="mb-5 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-field">
            <span className="h-px w-8 bg-field" />
            {copy.eyebrow}
          </p>
          <h1
            id="khelo-error-heading"
            className="max-w-[13ch] font-display text-5xl font-black leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {copy.heading}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
            {copy.description}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                Try again
              </button>
            ) : (
              <Link
                to="/explore"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                Explore the game
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            )}
            <Link
              to="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition hover:bg-secondary"
            >
              Back to home
            </Link>
          </div>

          <p className="mt-10 border-t border-border pt-5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Built for the players, teams, and tournaments next door.
          </p>
        </div>
      </section>
    </Page>
  );
}
