import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useKhelo } from "@/lib/services/store";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import type { Role } from "@/types";

interface NavItem {
  to: string;
  label: string;
}

const NAV: Record<Role | "GUEST", NavItem[]> = {
  GUEST: [
    { to: "/tournaments", label: "Tournaments" },
    { to: "/discover", label: "Discover talent" },
  ],
  ATHLETE: [
    { to: "/athlete", label: "Home" },
    { to: "/tournaments", label: "Tournaments" },
    { to: "/athlete/tournaments", label: "My sports" },
    { to: "/athlete/profile", label: "Profile" },
  ],
  ORGANIZER: [
    { to: "/organizer", label: "Dashboard" },
    { to: "/organizer/create", label: "Create tournament" },
    { to: "/organizer/results", label: "Results" },
  ],
  SCOUT: [
    { to: "/discover", label: "Discover" },
    { to: "/saved", label: "Saved athletes" },
    { to: "/connections", label: "Connections" },
  ],
  COLLEGE: [
    { to: "/college", label: "College desk" },
    { to: "/college/records", label: "Records" },
    { to: "/discover", label: "Discover athletes" },
    { to: "/tournaments", label: "Tournaments" },
  ],
  VOLUNTEER: [
    { to: "/volunteer", label: "My zone" },
    { to: "/tournaments", label: "Tournaments" },
    { to: "/discover", label: "Athletes" },
  ],
  ADMIN: [
    { to: "/admin", label: "Admin console" },
    { to: "/discover", label: "Athletes" },
    { to: "/tournaments", label: "Tournaments" },
  ],
};

export function AppShell({ children }: { children: ReactNode }) {
  const { currentUser, logout } = useKhelo();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = NAV[currentUser?.role ?? "GUEST"];

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
              className="size-9 rounded-full object-cover ring-2 ring-transparent transition group-hover:ring-lime/60"
              width={36}
              height={36}
            />
            <span className="font-display text-lg font-black tracking-tight">
              Khelo<span className="text-lime">Local</span>
            </span>
            <span className="hidden border-l border-border pl-3 font-ui text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground lg:inline">
              Indore / 01
            </span>
          </Link>

          <nav className="hidden flex-1 items-center gap-1 md:flex">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
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
                <div className="mr-1 text-right leading-tight">
                  <p className="text-sm font-semibold">{currentUser.name}</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    {currentUser.role}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="size-4" />
                  Log out
                </Button>
              </>
            ) : (
              <>
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
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
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
            <div className="mt-3 flex gap-2">
              {currentUser ? (
                <Button variant="outline" size="sm" className="w-full" onClick={() => { logout(); setOpen(false); }}>
                  Log out
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/login" onClick={() => setOpen(false)}>Log in</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link to="/signup" onClick={() => setOpen(false)}>Join</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-flow-col border-t border-border bg-background/95 backdrop-blur md:hidden">
        {items.slice(0, 4).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "py-3 text-center text-[11px] font-semibold uppercase tracking-wide",
              isActive(item.to) ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <footer className="border-t border-border bg-card pb-20 md:pb-0">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-16">
          <div className="max-w-xs">
            <Link to="/" className="font-display text-2xl font-black tracking-tight">
              Khelo<span className="text-lime">Local</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Your city's sports network. Starting in Indore, Madhya Pradesh.
            </p>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Play local. Prove your game.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
            <nav className="mt-4 flex flex-col items-start gap-3 text-sm font-semibold">
              <Link to="/tournaments" className="hover:text-lime">Tournaments</Link>
              <Link to="/discover" className="hover:text-lime">Discover talent</Link>
              <Link to="/signup" className="hover:text-lime">Join KheloLocal</Link>
            </nav>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">About</p>
            <nav className="mt-4 flex flex-col items-start gap-3 text-sm font-semibold">
              <Link to="/team" className="hover:text-lime">Founders team</Link>
              <Link to="/vision" className="hover:text-lime">Vision</Link>
              <Link to="/contact" className="hover:text-lime">Contact</Link>
              <Link to="/demo" className="hover:text-lime">Demo tools</Link>
            </nav>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Legal</p>
            <nav className="mt-4 flex flex-col items-start gap-3 text-sm font-semibold">
              <Link to="/terms" className="hover:text-lime">Terms</Link>
              <Link to="/privacy" className="hover:text-lime">Privacy policy</Link>
            </nav>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>© 2026 KheloLocal. Built for grassroots sport.</p>
            <p>Indore, Madhya Pradesh</p>
          </div>
        </div>
      </footer>
    </div>
  );
}