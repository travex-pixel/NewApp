import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { GroupCreate } from "@/components/group/GroupCreate";
import { storeEnabled } from "@/lib/server/store";

export const metadata: Metadata = {
  title: "Start a group",
  description: "One link for the group chat. Everyone plays the same five, then sees who's who.",
};

export default function NewGroupPage() {
  const on = storeEnabled();
  return (
    <div className="grain relative min-h-dvh">
      <div className="page flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
        <header className="flex items-center justify-between py-3">
          <Wordmark />
        </header>
        <main className="py-8">
          <h1 className="display" style={{ fontSize: "clamp(2.1rem, 9vw, 3rem)" }}>
            Who&rsquo;s who in the group chat?
          </h1>
          <p className="mt-3 muted" style={{ maxWidth: "40ch" }}>
            You get one link. Drop it in the group chat. Everyone plays the same five situations, then you all see each other&rsquo;s
            aura, who&rsquo;s most alike, and who&rsquo;s the wildcard.
          </p>
          <div className="mt-7" style={{ maxWidth: "24rem" }}>
            {on ? (
              <GroupCreate />
            ) : (
              <div className="grid gap-3">
                <p className="small muted">Groups aren&rsquo;t switched on yet. Play today&rsquo;s five for now.</p>
                <Link href="/play" className="btn btn-block">
                  Play today&rsquo;s 5
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
