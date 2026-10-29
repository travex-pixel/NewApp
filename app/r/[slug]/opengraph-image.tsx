import { ImageResponse } from "next/og";
import { ARCHETYPES, isArchetypeId } from "@/lib/game/archetypes";
import { loadOgFonts, OgFrame } from "@/lib/og";

export const alt = "A social aura on Instinct";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fonts = await loadOgFonts();
  const a = isArchetypeId(slug) ? ARCHETYPES[slug] : null;
  return new ImageResponse(
    (
      <OgFrame
        kicker="Social aura"
        title={a ? a.name : "Which one are you?"}
        body={a ? a.headline : "Five situations. Your gut instinct."}
        footer="Five situations. One gut instinct. Which one are you?"
      />
    ),
    { ...size, fonts },
  );
}
