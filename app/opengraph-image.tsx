import { ImageResponse } from "next/og";
import { loadOgFonts, OgFrame } from "@/lib/og";
import { TAGLINE } from "@/lib/site";

export const alt = "Instinct: think you read people well?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadOgFonts();
  return new ImageResponse(
    (
      <OgFrame
        title="Think you read people well?"
        body={TAGLINE}
        footer="No sign-up. Five situations. About three minutes."
      />
    ),
    { ...size, fonts },
  );
}
