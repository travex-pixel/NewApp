import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackGame } from "@/components/game/PackGame";
import { PACKS, getPack } from "@/lib/content/packs";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return PACKS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pack = getPack(id);
  if (!pack) return { title: "Not found" };
  return { title: `${pack.name} pack`, description: pack.blurb };
}

export default async function PackPage({ params }: Props) {
  const { id } = await params;
  if (!getPack(id)) notFound();
  return <PackGame packId={id} />;
}
