"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type Theme = "paper" | "schematic";

const THEMES: Theme[] = ["paper", "schematic"];

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === "schematic" ? "schematic" : "paper";

// The server renders Paper; the boot script in app/layout.tsx may already have
// switched <html>, and useSyncExternalStore reconciles after hydration.
const serverTheme = (): Theme => "paper";

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("corsw-theme", next);
  } catch {
    // Storage blocked: the choice lasts for this page view only.
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, serverTheme);

  return (
    <div
      role="group"
      aria-label="Theme"
      className={cn("flex items-baseline gap-1 print:hidden", className)}
    >
      {THEMES.map((t, i) => (
        <span key={t} className="flex items-baseline gap-1">
          {i > 0 && (
            <span aria-hidden="true" className="text-ink-faint">
              /
            </span>
          )}
          <button
            type="button"
            aria-pressed={theme === t}
            onClick={() => applyTheme(t)}
            className="cursor-pointer px-1 py-2 uppercase tracking-[0.22em] text-ink-faint underline decoration-transparent underline-offset-4 transition-colors duration-150 hover:text-ink-muted focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent aria-pressed:text-ink aria-pressed:decoration-accent"
          >
            {t}
          </button>
        </span>
      ))}
    </div>
  );
}
