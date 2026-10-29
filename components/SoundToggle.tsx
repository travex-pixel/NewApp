"use client";

import { Volume2, VolumeX } from "lucide-react";
import { setSoundEnabled, useSoundEnabled } from "@/lib/sound";
import { useHydrated } from "@/lib/game/progress-store";

export function SoundToggle() {
  const hydrated = useHydrated();
  const on = useSoundEnabled();
  const label = on ? "Turn sound off" : "Turn sound on";
  return (
    <button
      type="button"
      className="iconbtn"
      aria-label={label}
      title={label}
      aria-pressed={hydrated ? on : undefined}
      onClick={() => setSoundEnabled(!on)}
    >
      {on ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
    </button>
  );
}
