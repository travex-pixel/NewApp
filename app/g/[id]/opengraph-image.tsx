import { ImageResponse } from "next/og";
import { loadOgFonts, OgFrame } from "@/lib/og";

export const alt = "Who's who in the group chat? Instinct";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadOgFonts();
  return new ImageResponse(
    (
      <OgFrame
        kicker="A group game"
        title="Who's who in the group chat?"
        body="Everyone plays the same five everyday situations. Then you see each other's aura, who's most alike, and who's the wildcard."
        footer="About a minute each. No sign-up."
      />
    ),
    { ...size, fonts },
  );
}
