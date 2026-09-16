export type Tone = "bone" | "ink" | "carbon";

type Role =
  | "--bg"
  | "--bg-card"
  | "--ink"
  | "--ink-muted"
  | "--ink-faint"
  | "--ink-rule"
  | "--accent"
  | "--grid-opacity"
  | "--dots-opacity";

export type ToneVars = Record<Role, string>;

/**
 * The three chapters the site scrolls through. Components read only the role
 * names; ToneScroller scrubs these values on <html> between sections.
 * Contrast floors are asserted in tones.test.mjs.
 */
export const TONES: Record<Tone, ToneVars> = {
  bone: {
    "--bg": "#ece6da",
    "--bg-card": "#e3dccf",
    "--ink": "#141310",
    "--ink-muted": "#45423c",
    "--ink-faint": "#5f5b54",
    "--ink-rule": "#d3cbbd",
    "--accent": "#a8341e",
    "--grid-opacity": "1",
    "--dots-opacity": "0",
  },
  ink: {
    "--bg": "#0e0e0e",
    "--bg-card": "#161513",
    "--ink": "#f5f1e8",
    "--ink-muted": "#a8a39a",
    "--ink-faint": "#847f76",
    "--ink-rule": "#2a2825",
    "--accent": "#d7543d",
    "--grid-opacity": "0",
    "--dots-opacity": "0",
  },
  carbon: {
    "--bg": "#0a0b0f",
    "--bg-card": "#111317",
    "--ink": "#e8eaed",
    "--ink-muted": "#9ca3af",
    "--ink-faint": "#767d8c",
    "--ink-rule": "#1f2228",
    "--accent": "#d7543d",
    "--grid-opacity": "0",
    "--dots-opacity": "1",
  },
};

const declarations = (vars: ToneVars) =>
  Object.entries(vars)
    .map(([role, value]) => `${role}:${value}`)
    .join(";");

/**
 * Injected once by app/layout.tsx. `:root` is bone; `data-tone-start` on
 * <main> picks the page's first tone; until ToneScroller adds `tones-live`
 * (no JS, reduced motion) each section paints its own tone.
 */
export function toneCss(): string {
  const tones = Object.keys(TONES) as Tone[];
  return [
    `:root{${declarations(TONES.bone)}}`,
    ...tones.map((t) => `html:has(main[data-tone-start="${t}"]){${declarations(TONES[t])}}`),
    ...tones.map(
      (t) =>
        `html:not(.tones-live) [data-tone="${t}"]{${declarations(TONES[t])};background-color:var(--bg);color:var(--ink)}`,
    ),
  ].join("\n");
}
