"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { PALETTES, applyPalette, type PaletteId } from "@/lib/palettes";
import { play } from "@/lib/sound";

const listeners = new Set<() => void>();
function current(): PaletteId {
  return ((document.documentElement.dataset.palette as PaletteId) ?? "espresso") || "espresso";
}

export function PalettePicker() {
  const active = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    current,
    () => "espresso" as PaletteId,
  );

  function choose(id: PaletteId) {
    applyPalette(id);
    play.tap();
    for (const l of listeners) l();
  }

  return (
    <div className="grid gap-3">
      {PALETTES.map((p) => {
        const on = active === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => choose(p.id)}
            aria-pressed={on}
            className="option"
            style={{ gridTemplateColumns: "auto 1fr auto", alignItems: "center", padding: "0.9rem" }}
          >
            <span className="flex" aria-hidden="true">
              {p.swatch.map((c, i) => (
                <span
                  key={c}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    background: c,
                    border: "2px solid var(--surface)",
                    marginLeft: i ? -8 : 0,
                    boxShadow: "var(--shadow-sm)",
                  }}
                />
              ))}
            </span>
            <span>
              <span className="block font-semibold">{p.name}</span>
              <span className="block small muted mt-0.5">{p.blurb}</span>
            </span>
            <span aria-hidden="true" style={{ width: 22 }}>
              {on ? <Check size={20} className="accent" /> : null}
            </span>
          </button>
        );
      })}
      <Link href="/play" className="btn btn-block mt-3">
        Try it in the game
      </Link>
      <p className="small faint">Your pick is saved on this phone. Tell me which one you like and I&rsquo;ll make it the default for everyone.</p>
    </div>
  );
}
