# Instinct — design system: Espresso & Olive

## The idea

An independent magazine about human behaviour, crossed with a very well-made phone game. The situation and the decision happen on warm paper. The moment you choose, dark ink wipes up over the page and the verdict is printed on it. Paper is uncertainty; ink is understanding. Terracotta is the one loud colour and marks the signal: the current step, the chosen letter, the verdict tag, the cost. Olive is the quiet one: categories, progress done, the motif.

Motif: the fork. One path becoming two, drawn horizontally so it reads as a road splitting, never a letter. The wordmark, the favicon, the social image, and the six archetype marks (split, merge, straight, loop, pause, leap) are all built from it with the same stroke.

## Palettes

Three palettes share one set of tokens, switched with `<html data-palette>`: **Espresso & Olive** (default), **Eucalyptus & Clay** and **Midnight & Marigold**. Preview them on a phone at `/palettes`. The choice is saved locally and applied before first paint by an inline script in the layout. The exported PNG card always uses Espresso until a palette is chosen as the default.

## Depth

Paper has a faint grain. Answer options are raised cards (`--surface`, `--shadow-md`), so they sit on the page rather than in it. Buttons carry `--shadow-md`. The aura card uses `--shadow-xl`, tilts under the finger and catches a single sheen when it arrives.

## Tokens (`app/globals.css`)

| Token | Paper | Ink |
|---|---|---|
| `--bg` | `#f4f1ea` | `#1a1c19` |
| `--fg` | `#2d2b29` (12.6:1) | `#f4f1ea` (15.5:1) |
| `--fg-2` secondary | `#5e5a54` (6.1:1) | `#b8b3a7` (8.4:1) |
| `--fg-3` tertiary | `#8a857c` | `#8e897e` |
| `--line` | `#ddd8cc` | `#383b34` |
| `--accent` terracotta | `#c84b31` | `#e05a47` (4.8:1) |
| `--accent-2` olive | `#5c6340` (5.6:1) | `#a3a882` |

Switch worlds with the `.ink` class. Radii: 6 / 12 / 18px. No other colours, no gradients beyond the faint olive wash behind the desktop shell.

## Type

- **Display:** Fraunces, variable, optical sizing on. Situation titles and verdicts at 1.5–1.9rem, weight 500, tracking −0.02em. Archetype names at weight 600–700. Italic for the echo of the player's choice and the card headline only.
- **Interface:** Instrument Sans. Setup text 1.0625rem/1.45. Options 1rem/1.4 weight 500. Consequences 0.9375rem. Buttons 1.0625rem weight 600.
- Two small uppercase labels exist in the whole product ("What it gets you", "What it costs"), plus their result-screen cousins. Nothing else is uppercase.

## Layout: the shell

Every game screen is a fixed, full-viewport grid. The answer options live in the footer tray, so they are always in reach and the situation sits above them. Extra detail (the other answers, what an aura means, the collection) opens in a bottom sheet instead of growing the page. The grid is: `auto / minmax(0,1fr) / auto`. Header (wordmark + progress), main (centred when there's room, scrolls internally only when the device is genuinely too short), footer (one full-width CTA with safe-area padding). The page itself never scrolls during play; `body[data-game="on"]` locks it. At 390×844 the situation and the reveal fit with zero overflow; the test suite and `qa.mjs` check this.

Desktop is the same column at 34rem with a faint olive wash, not a stretched phone.

## Controls

- `.btn` ink-on-paper (paper-on-ink in the ink world), 52px, radius 12. `.btn-ghost` outlined. `.btn-accent` terracotta, used for the share action only.
- `.option` answer rows: 1px line, radius 12, olive letter badge. Selected: fills ink, badge turns terracotta. Others dim to 45%. `whileTap` scales to 0.985.
- `.marks` progress: five 4px marks, done olive, current terracotta and wider.
- `.drawer-toggle` + `.drawer-body`: the "other paths" accordion, bounded to `min(28dvh, 300px)` with internal scroll so the CTA never moves.
- `.aura-card`: the 4:5 collectible. Paper, inner hairline frame, motif, name, headline, terracotta bar, host.

## Sound and haptics

Synthesised with Web Audio (`lib/sound.ts`), no files. A soft two-note pick, a swoosh and low bell on the reveal, a page-turn between situations, ticks while your five are read back, and a rising chord when the aura lands. Quiet by default, follows the iPhone silent switch, and the speaker button in the header turns it off for good. Android gets a short vibration on pick and on the aura.

## Motion

One choreographed moment: the ink sheet wipes up (`clip-path`, 550ms, `cubic-bezier(0.16,1,0.3,1)`), then the choice echo, verdict, consequences and drawer fade up in a 120–550ms stagger. Situations fade in over 350ms. The accordion animates height over 280ms. `prefers-reduced-motion` replaces all of it with 200ms fades. No confetti; the celebration is the card.

## Copy

British spelling. The verdict is second person and specific ("You kept the table warm and took the hit"). Consequences are one or two concrete lines each. Archetype copy is affectionate roast: it can tease, never humiliate, and it never claims to measure a person. Controls name their action.

## Don'ts

Gradient decoration, glass, glow, emoji as icons, progress rings, feature grids, cards in cards, fake numbers, "unlock", "level up", "AI-powered".
