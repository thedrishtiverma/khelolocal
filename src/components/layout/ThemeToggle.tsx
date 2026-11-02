import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "khelolocal.theme";
type ThemeMode = "dark" | "light";

function apply(mode: ThemeMode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const nextMode: ThemeMode = stored === "dark" ? "dark" : "light";
    setMode(nextMode);
    apply(nextMode);
    if (stored === "auto") localStorage.setItem(KEY, nextMode);
    setReady(true);
  }, []);

  useEffect(() => {
    const syncMode = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const nextMode: unknown = event.detail;
      if (nextMode === "dark" || nextMode === "light") setMode(nextMode);
    };

    window.addEventListener("khelolocal-theme-change", syncMode);
    return () => window.removeEventListener("khelolocal-theme-change", syncMode);
  }, []);

  const toggle = () => {
    const nextMode: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
    apply(nextMode);
    localStorage.setItem(KEY, nextMode);
    window.dispatchEvent(new CustomEvent("khelolocal-theme-change", { detail: nextMode }));
  };

  const nextModeDescription = mode === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Theme is ${mode}. Activate to switch to ${nextModeDescription} mode.`}
      title={`Theme: ${mode}. Click to switch to ${nextModeDescription} mode.`}
      className={
        "inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-accent hover:text-accent-ink " +
        (ready ? "" : "opacity-0 ") +
        (className ?? "")
      }
    >
      {mode === "dark" ? (
        <Moon aria-hidden="true" className="size-4" />
      ) : (
        <Sun aria-hidden="true" className="size-4" />
      )}
    </button>
  );
}
