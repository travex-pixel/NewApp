import { ImageResponse } from "next/og";
import { decodeChallenge } from "@/lib/game/challenge";
import { loadOgFonts, OgFrame } from "@/lib/og";

export const alt = "Someone sent you a situation on Instinct";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const challenge = decodeChallenge(code);
  const fonts = await loadOgFonts();

  const title = challenge ? challenge.scenario.title : "A situation, sent to you";
  const line = challenge
    ? challenge.scenario.setup[0]
    : "This link didn't decode, but the game is still here.";

  return new ImageResponse(
    (
      <OgFrame
        kicker="Someone sent you this. What would you do?"
        title={title}
        body={line}
        footer="Their answer is hidden until yours is in."
      />
    ),
    { ...size, fonts },
  );
}
