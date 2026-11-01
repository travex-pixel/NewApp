import type { Metadata } from "next";
import { Suspense } from "react";
import { GroupRoom } from "@/components/group/GroupRoom";
import { Wordmark } from "@/components/Wordmark";
import { SITE_NAME } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Who's who in the group chat?",
  description: "Everyone plays the same five situations, then sees each other's aura.",
  robots: { index: false },
  openGraph: {
    title: `Who's who in the group chat? · ${SITE_NAME}`,
    description: "Everyone plays the same five situations, then sees each other's aura.",
    type: "website",
  },
};

async function Room({ params }: Props) {
  const { id } = await params;
  return <GroupRoom id={id.toLowerCase()} />;
}

export default function GroupPage(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="page" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
          <header className="flex items-center justify-between py-3">
            <Wordmark />
          </header>
        </div>
      }
    >
      <Room params={props.params} />
    </Suspense>
  );
}
