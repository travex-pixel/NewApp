import type { Metadata } from "next";
import { Wordmark } from "@/components/Wordmark";
import { PalettePicker } from "@/components/PalettePicker";

export const metadata: Metadata = {
  title: "Palettes",
  robots: { index: false },
};

export default function PalettesPage() {
  return (
    <div className="page min-h-dvh flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
      <header className="flex items-center justify-between py-3">
        <Wordmark />
      </header>
      <main className="py-8">
        <h1 className="display" style={{ fontSize: "clamp(2rem, 8vw, 2.75rem)" }}>
          Pick a palette
        </h1>
        <p className="muted mt-3">Tap one, then play a round to see it in action. You can come back and switch any time.</p>
        <div className="mt-6">
          <PalettePicker />
        </div>
      </main>
    </div>
  );
}
