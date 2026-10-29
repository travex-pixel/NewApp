# Instinct — design system

## The idea

Paper and ink. The situation and the decision happen on warm paper, set in a serif, like a column you're reading. The moment you choose, ink rises over the page and the reveal is printed on it. Uncertainty is paper; understanding is ink. One accent, vermilion, marks the signal: the current step, the strong read, the challenge.

Motif: the fork. One path becoming two, drawn horizontally so it reads as a road splitting and never as a letter. Wordmark, favicon, social image, empty states. Nowhere else.

## Tokens (`app/globals.css`)

| Token | Paper world | Ink world |
|---|---|---|
| `--bg` | `#f3eee4` paper | `#1b1917` ink |
| `--fg` | `#1b1917` | `#f3eee4` |
| `--fg-2` secondary text | `#4a453f` (8.2:1) | `#b9b1a3` (8.3:1) |
| `--fg-3` tertiary | `#7a736a` | `#8d8578` |
| `--line` hairlines | `#cfc6b6` | `#3a3631` |
| `--accent` | `#b8371a` (5.0:1 on paper) | `#f0623a` (5.5:1 on ink) |
| `--surface-2` pressed/selected | `#e8e1d2` | `#26231f` |

Switch worlds with the `.ink` class; everything beneath re-reads its tokens. No other colours exist.

## Type

- **Display / narrative:** Fraunces (variable, optical sizing on). Headlines at weight 500, tracking −0.022em, line-height 1.02. Scenario text at 1.25–1.375rem, weight 400. Principles as pull-quotes at 1.75rem. Italic only for the echo of the player's choice and the result artefact line.
- **Interface:** Instrument Sans (variable). Body 1rem/1.55. Choices 1.0625rem weight 500. Buttons weight 600. Small text 0.875rem.
- Run-in heads (`.runin`) instead of labels above paragraphs. No eyebrows, no kickers.

## Layout

One column, `max-width: 38rem`, 20px gutters on phones, 32px from 640px. Header is wordmark left, state right (meter / date / "A challenge"). Reading measure capped at 62ch for prose, 34rem for narrative.

Hairlines separate; cards don't. The single exception is `.artefact`, the result composition built to be screenshotted, which gets a 1px border and one soft offset shadow.

## Controls

- `.btn` ink-on-paper (paper-on-ink in the ink world), 52px min height, 6px radius. `.btn-ghost` outlined. `.btn-accent` vermilion, used once per screen at most.
- `.choice` rows: hairline top/bottom, a 28px circular letter marker, text. Selected: marker fills, row tints left-to-right. Others dim to 38%.
- `.meter`: five 2px hairline segments. Done = ink, current = accent.
- Focus: 2px accent outline, 3px offset. Selection colour is the accent.

## Motion

One authored moment: `ink-rise`, the ink sheet wiping up over the paper (clip-path, 620ms, `cubic-bezier(0.16,1,0.3,1)`), its content fading up 240ms later. Scenario entry is a 480ms fade-up. The chosen marker pops once. Everything else is a 140–160ms transition. `prefers-reduced-motion` replaces the wipe with a 220ms fade and removes the rest.

## Copy

British spelling. Short sentences. Controls name their action ("Next situation", "See the round", "Challenge a friend with this one"). Praise only when earned ("Good instinct" for a strong read; "That one bit" for a backfire). Never "unlock", "level up", "AI-powered".

## Don'ts

Gradients as decoration, glass, glow, emoji as icons, progress rings, three-column feature grids, cards inside cards, fake numbers of any kind.
