import { useEffect, useState } from "react";
import { Clock3, Moon, Sun } from "lucide-react";

const KEY = "khelolocal.theme";
type ThemeMode = "auto" | "dark" | "light";

function apply(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

function isNightTime() {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>("auto");
  const [ready, setReady] = useState(false);
  const dark = mode === "auto" ? isNightTime() : mode === "dark";

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const nextMode: ThemeMode =
      stored === "dark" || stored === "light" || stored === "auto" ? stored : "auto";
    setMode(nextMode);
    apply(nextMode === "auto" ? isNightTime() : nextMode === "dark");
    setReady(true);
  }, []);

  useEffect(() => {
    if (mode !== "auto") return;

    const syncWithTime = () => apply(isNightTime());
    syncWithTime();
    const interval = window.setInterval(syncWithTime, 60_000);
    document.addEventListener("visibilitychange", syncWithTime);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", syncWithTime);
    };
  }, [mode]);

  const toggle = () => {
    const nextMode: ThemeMode = mode === "auto" ? "dark" : mode === "dark" ? "light" : "auto";
    setMode(nextMode);
    apply(nextMode === "auto" ? isNightTime() : nextMode === "dark");
    localStorage.setItem(KEY, nextMode);
  };

  const modeDescription =
    mode === "auto" ? "automatic, dark from 6 PM to 6 AM" : mode === "dark" ? "dark" : "light";
  const nextModeDescription = mode === "auto" ? "dark" : mode === "dark" ? "light" : "automatic";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Theme is ${modeDescription}. Activate to switch to ${nextModeDescription} mode.`}
      title={`Theme: ${modeDescription}. Click to switch to ${nextModeDescription} mode.`}
      className={
        "inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-accent hover:text-accent-ink " +
        (ready ? "" : "opacity-0 ") +
        (className ?? "")
      }
    >
      {mode === "auto" ? (
        <Clock3 aria-hidden="true" className="size-4" />
      ) : dark ? (
        <Moon aria-hidden="true" className="size-4" />
      ) : (
        <Sun aria-hidden="true" className="size-4" />
      )}
    </button>
  );
}
