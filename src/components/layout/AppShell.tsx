import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ChevronDown, Instagram, Linkedin, LogOut, Menu, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useKhelo } from "@/lib/services/store";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import type { Role } from "@/types";

interface NavItem {
  to: string;
  label: string;
}

const PUBLIC_NAV: NavItem[] = [
  { to: "/explore", label: "Explore" },
  { to: "/tournaments", label: "Tournaments" },
  { to: "/athletes", label: "Athletes" },
  { to: "/organizers", label: "For organizers" },
];

const PROFILE_NAV: Record<Role, NavItem[]> = {
  ATHLETE: [
    { to: "/athlete/profile", label: "My profile" },
    { to: "/athlete/tournaments", label: "My tournaments" },
  ],
  ORGANIZER: [
    { to: "/organizer", label: "Organizer dashboard" },
    { to: "/organizer/results", label: "Results" },
  ],
  SCOUT: [
    { to: "/scout", label: "Scout dashboard" },
    { to: "/saved", label: "Saved athletes" },
    { to: "/connections", label: "Connections" },
  ],
  COLLEGE: [
    { to: "/college", label: "Institution dashboard" },
    { to: "/college/records", label: "Records" },
  ],
  VOLUNTEER: [{ to: "/volunteer/desk", label: "Field desk" }],
  ADMIN: [{ to: "/admin", label: "Admin console" }],
};

export function AppShell({ children }: { children: ReactNode }) {
  const { currentUser, logout } = useKhelo();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const profileItems = currentUser ? PROFILE_NAV[currentUser.role] : [];

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/90 bg-background/95 shadow-[0_4px_18px_-14px_var(--foreground)] backdrop-blur-xl">
        <div className="tricolor-rule h-0.5 w-full" />
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-2">
            <img
              src="/android-chrome-192x192.png"
              alt="KheloLocal logo"
              className="size-10 rounded-full object-cover ring-2 ring-transparent transition group-hover:ring-lime/60"
              width={40}
              height={40}
            />
            <span className="font-display text-xl font-black tracking-tight">
              Khelo<span className="text-lime">Local</span>
            </span>
            <span className="hidden border-l border-border pl-3 font-ui text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground lg:inline">
              Indore / 01
            </span>
          </Link>

          <nav className="hidden flex-1 items-center gap-1 md:flex">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isActive(item.to) ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground",
                  isActive(item.to) && "bg-card text-foreground shadow-sm ring-1 ring-border",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <ThemeToggle />
            {currentUser ? (
              <>
                <Button asChild size="sm">
                  <Link to="/tournaments/create">
                    <span className="text-lg leading-none">+</span> Create tournament
                  </Link>
                </Button>
                <details className="relative">
                  <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-lime">
                    <UserRound className="size-4" /> Profile <ChevronDown className="size-4" />
                  </summary>
                  <div className="absolute right-0 top-11 z-50 min-w-52 rounded-xl border border-border bg-card p-2 shadow-xl">
                    <p className="border-b border-border px-3 pb-2 text-xs text-muted-foreground">
                      {currentUser.name}
                    </p>
                    {profileItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="mt-1 block rounded-md px-3 py-2 text-sm font-semibold hover:bg-secondary"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={logout}
                      className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="size-4" /> Log out
                    </button>
                  </div>
                </details>
              </>
            ) : (
              <>
                <Button asChild size="sm">
                  <Link to="/tournaments/create">
                    <span className="text-lg leading-none">+</span> Create tournament
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/signup">Join KheloLocal</Link>
                </Button>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2 md:hidden">
            <ThemeToggle />
          </div>
          <button
            className="md:hidden"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-border bg-background px-4 py-3 md:hidden">
            <nav className="flex flex-col">
              {PUBLIC_NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={isActive(item.to) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded px-3 py-2.5 text-sm font-semibold",
                    isActive(item.to) ? "bg-secondary" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {profileItems.length ? (
              <div className="mt-3 border-t border-border pt-3">
                <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Your workspace
                </p>
                {profileItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block rounded px-3 py-2.5 text-sm font-semibold text-muted-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
            <div className="mt-3 flex gap-2">
              {currentUser ? (
                <>
                  <Button asChild size="sm" className="flex-1">
                    <Link to="/tournaments/create" onClick={() => setOpen(false)}>
                      + Create tournament
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/login" onClick={() => setOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link to="/signup" onClick={() => setOpen(false)}>
                      Join
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background/95 backdrop-blur md:hidden">
        {PUBLIC_NAV.slice(0, 4).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            aria-current={isActive(item.to) ? "page" : undefined}
            className={cn(
              "py-3 text-center text-[11px] font-semibold uppercase tracking-wide",
              isActive(item.to) ? "text-foreground" : "text-muted-foreground",
            )}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link
          to={currentUser ? (profileItems[0]?.to ?? "/") : "/login"}
          aria-current={
            pathname.startsWith("/athlete") ||
            pathname.startsWith("/organizer") ||
            pathname.startsWith("/college")
              ? "page"
              : undefined
          }
          className="py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Profile
        </Link>
      </nav>

      <footer className="border-t border-border bg-card pb-20 md:pb-0">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.35fr_1fr_1fr_1fr_0.9fr] md:py-16">
          <div className="max-w-xs">
            <Link
              to="/"
              className="flex items-center gap-3 font-display text-[1.8rem] font-black tracking-tight"
            >
              <img
                src="/android-chrome-192x192.png"
                alt=""
                className="size-11 rounded-full object-cover"
                width={44}
                height={44}
              />
              <span>
                Khelo<span className="text-lime">Local</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Your city's sports network. Starting in Indore, Madhya Pradesh.
            </p>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Play local. Prove your game.
            </p>
            <a
              href="mailto:khelolocal@gmail.com"
              className="mt-4 inline-block text-sm font-semibold hover:text-lime"
            >
              khelolocal@gmail.com
            </a>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Explore
            </p>
            <nav className="mt-4 flex flex-col items-start gap-3 text-sm font-semibold">
              <Link to="/explore" className="hover:text-lime">
                Explore
              </Link>
              <Link to="/tournaments" className="hover:text-lime">
                Tournaments
              </Link>
              <Link to="/athletes" className="hover:text-lime">
                Athletes
              </Link>
              <Link to="/sports" className="hover:text-lime">
                Sports
              </Link>
              <Link to="/teams" className="hover:text-lime">
                Teams
              </Link>
              <Link to="/map" className="hover:text-lime">
                Sports map
              </Link>
              <Link to="/stories" className="hover:text-lime">
                Community stories
              </Link>
            </nav>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Build the game
            </p>
            <nav className="mt-4 flex flex-col items-start gap-3 text-sm font-semibold">
              <Link to="/organizers" className="hover:text-lime">
                For organizers
              </Link>
              <Link to="/institutions" className="hover:text-lime">
                For institutions
              </Link>
            </nav>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              KheloLocal
            </p>
            <nav className="mt-4 flex flex-col items-start gap-3 text-sm font-semibold">
              <Link to="/vision" className="hover:text-lime">
                About
              </Link>
              <Link to="/how-it-works" className="hover:text-lime">
                How it works
              </Link>
              <Link to="/cities" className="hover:text-lime">
                Our cities
              </Link>
              <Link to="/team" className="hover:text-lime">
                Founders team
              </Link>
              <Link to="/shop" className="hover:text-lime">
                KheloLocal merch
              </Link>
              <Link to="/contact" className="hover:text-lime">
                Contact
              </Link>
              <Link to="/volunteer" className="hover:text-lime">
                Volunteer with us
              </Link>
              <Link to="/careers" className="hover:text-lime">
                Careers
              </Link>
              <Link to="/verification" className="hover:text-lime">
                Verified record
              </Link>
            </nav>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Legal
            </p>
            <nav className="mt-4 flex flex-col items-start gap-3 text-sm font-semibold">
              <Link to="/terms" className="hover:text-lime">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-lime">
                Privacy policy
              </Link>
            </nav>
            <div className="mt-8 border-t border-border pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Feedback
              </p>
              <Link
                to="/feedback"
                className="mt-4 inline-block text-sm font-semibold hover:text-lime"
              >
                Shape the next match
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border px-4 py-7 sm:px-6">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Follow the local game
          </p>
          <nav className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold">
            <a
              href="https://www.instagram.com/khelolocal"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-lime"
            >
              <Instagram className="size-4" /> Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/khelolocal"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-lime"
            >
              <Linkedin className="size-4" /> LinkedIn
            </a>
          </nav>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>© 2026 KheloLocal. Built for grassroots sport.</p>
            <p className="made-with-love font-bold text-foreground">
              Made with <span aria-label="love">♥</span>
            </p>
            <p>Indore, Madhya Pradesh</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
