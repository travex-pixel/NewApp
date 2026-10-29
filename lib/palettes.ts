/** The palettes you can preview at /palettes. Tokens live in globals.css. */
export const PALETTE_KEY = "instinct:palette";

export const PALETTES = [
  {
    id: "espresso",
    name: "Espresso & Olive",
    blurb: "Warm paper, espresso dark, terracotta. Bookish and grown up.",
    swatch: ["#f3efe6", "#1a1c19", "#c84b31", "#5c6340"],
  },
  {
    id: "eucalyptus",
    name: "Eucalyptus & Clay",
    blurb: "Gum-leaf green and red earth. The most Australian of the three.",
    swatch: ["#edf0e9", "#13201a", "#c4532a", "#4f7059"],
  },
  {
    id: "midnight",
    name: "Midnight & Marigold",
    blurb: "Cream paper, inky navy, a warm marigold glow. The most night-out.",
    swatch: ["#f5f0e6", "#121229", "#f2a541", "#4a5488"],
  },
] as const;

export type PaletteId = (typeof PALETTES)[number]["id"];

/** Apply and remember a palette. Browser only. */
export function applyPalette(id: PaletteId): void {
  document.documentElement.setAttribute("data-palette", id);
  try {
    window.localStorage.setItem(PALETTE_KEY, id);
  } catch {
    /* unavailable */
  }
}
