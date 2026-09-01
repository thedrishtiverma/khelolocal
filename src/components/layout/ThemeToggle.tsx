import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "khelolocal.theme";

function apply(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const next =
      stored === "dark" ||
      (stored === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(next);
    apply(next);
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
        "inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-lime hover:text-lime " +
        (className ?? "")
      }
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
