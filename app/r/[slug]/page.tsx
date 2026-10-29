import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AuraCard } from "@/components/game/AuraCard";
import { Wordmark } from "@/components/Wordmark";
import { ARCHETYPES, ARCHETYPE_IDS, isArchetypeId } from "@/lib/game/archetypes";
import { SITE_NAME } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARCHETYPE_IDS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isArchetypeId(slug)) return { title: "Not found" };
  const a = ARCHETYPES[slug];
  return {
    title: a.name,
    description: `${a.headline} Five situations, gut instinct. Which one are you?`,
    openGraph: {
      title: `${a.name} · ${SITE_NAME}`,
      description: `${a.headline} Which one are you?`,
      type: "website",
    },
  };
}

export default async function ResultPage({ params }: Props) {
  const { slug } = await params;
  if (!isArchetypeId(slug)) notFound();
  const a = ARCHETYPES[slug];

  return (
    <div className="ink min-h-dvh flex flex-col">
      <div className="page flex-1 flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
        <header className="flex items-center justify-between py-3">
          <Wordmark />
          <span className="small muted">A social aura</span>
        </header>
        <main className="flex-1 py-6">
          <AuraCard archetype={a} />
          <div className="mt-6" style={{ maxWidth: "34rem", marginInline: "auto" }}>
            <p style={{ color: "var(--fg-2)", textWrap: "pretty" }}>{a.description}</p>
            <h1 className="display mt-7" style={{ fontSize: "clamp(1.75rem, 7vw, 2.25rem)" }}>
              Which one are you?
            </h1>
            <p className="small muted mt-2">Five everyday situations, four ways to respond, one surprisingly revealing result. About a minute.</p>
            <Link href="/play" className="btn btn-block mt-5">
              Play today&rsquo;s 5 <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </main>
        <footer className="py-6 small faint">A read of five choices, not a diagnosis of anyone.</footer>
      </div>
    </div>
  );
}
