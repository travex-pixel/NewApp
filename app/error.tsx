"use client";

import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="page flex-1 flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
      <header className="flex items-center justify-between py-3">
        <Wordmark />
      </header>
      <main className="pt-12">
        <h1 className="display" style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}>
          Something went wrong on our side.
        </h1>
        <p className="mt-4" style={{ color: "var(--fg-2)", maxWidth: "44ch" }}>
          Your progress on this device is safe. Try again, or start a fresh round.
        </p>
        <div className="mt-8 grid gap-3" style={{ maxWidth: "26rem" }}>
          <button type="button" className="btn btn-block" onClick={() => reset()}>
            Try again
          </button>
          <Link href="/play" className="btn btn-ghost btn-block">Play a round</Link>
        </div>
      </main>
    </div>
  );
}
