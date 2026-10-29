import { ARCHETYPES, isArchetypeId } from "@/lib/game/archetypes";
import { auraCardImage } from "@/lib/aura-image";

/** The portrait (4:5) social aura card as a PNG. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isArchetypeId(slug)) return new Response("Not found", { status: 404 });
  const image = await auraCardImage(ARCHETYPES[slug], "portrait");
  image.headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800");
  return image;
}
