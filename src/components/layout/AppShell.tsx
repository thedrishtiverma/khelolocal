import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useKhelo } from "@/lib/services/store";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import logo from "@/assets/khelolocal-logo.png.asset.json";
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
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="tricolor-rule h-0.5 w-full" />
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo.url}
              alt="KheloLocal logo"
              className="size-9 rounded-full object-cover"
              width={36}
              height={36}
            />
            <span className="font-display text-lg font-black tracking-tight">
              Khelo<span className="text-lime">Local</span>
            </span>
          </Link>

          <nav className="hidden flex-1 items-center gap-1 md:flex">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground",
                  isActive(item.to) && "bg-secondary text-foreground",
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
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  Log out
                </Button>
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

      <footer className="hidden border-t border-border bg-card md:block">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
          <p>
            <span className="font-display font-bold text-foreground">KheloLocal</span> — your city's
            sports network. Starting in Indore, Madhya Pradesh.
          </p>
          <Link to="/demo" className="text-xs uppercase tracking-widest hover:text-foreground">
            Demo tools
          </Link>
        </div>
      </footer>
    </div>
  );
}
