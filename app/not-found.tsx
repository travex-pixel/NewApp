import Link from "next/link";
import { ForkMark } from "@/components/ForkMark";
import { Wordmark } from "@/components/Wordmark";

export default function NotFound() {
  return (
    <div className="page flex-1 flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
      <header className="flex items-center justify-between py-3">
        <Wordmark />
      </header>
      <main className="pt-12">
        <ForkMark size={36} />
        <h1 className="display mt-5" style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}>
          Nothing here.
        </h1>
        <p className="mt-4" style={{ color: "var(--fg-2)", maxWidth: "44ch" }}>
          That page doesn&rsquo;t exist. The situations do.
        </p>
        <div className="mt-8 grid gap-3" style={{ maxWidth: "26rem" }}>
          <Link href="/play" className="btn btn-block">Play a round</Link>
          <Link href="/" className="btn btn-ghost btn-block">Home</Link>
        </div>
      </main>
    </div>
  );
}
