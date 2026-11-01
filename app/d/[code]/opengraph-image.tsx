import { ImageResponse } from "next/og";
import { decodeDuel } from "@/lib/game/duel";
import { loadOgFonts, OgFrame } from "@/lib/og";

export const alt = "Do you think alike? A five-situation challenge on Instinct";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const duel = decodeDuel(code);
  const fonts = await loadOgFonts();
  const titles = duel ? duel.round.map((s) => s.title).slice(0, 3).join(" · ") : "Five everyday situations";
  return new ImageResponse(
    (
      <OgFrame
        kicker="Your friend played these five"
        title="Do you think alike?"
        body={titles}
        footer="Play the same five. See how you compare."
      />
    ),
    { ...size, fonts },
  );
}
