import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "khelolocal.theme";

function apply(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const next =
      stored === "dark" ||
      (stored === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(next);
    apply(next);
    setReady(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    apply(next);
    localStorage.setItem(KEY, next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={
        "inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-accent hover:text-accent-ink " +
        (ready ? "" : "opacity-0 ") +
        (className ?? "")
      }
    >
      <span className="relative block size-4">
        <Sun
          className={
            "absolute inset-0 size-4 transition-all duration-300 " +
            (dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0")
          }
        />
        <Moon
          className={
            "absolute inset-0 size-4 transition-all duration-300 " +
            (dark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100")
          }
        />
      </span>
    </button>
  );
}
