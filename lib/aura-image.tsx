import { ImageResponse } from "next/og";
import type { Archetype } from "@/lib/game/archetypes";
import { motifPath } from "@/components/game/MotifMark";
import { SITE_HOST } from "@/lib/site";
import { loadOgFonts } from "./og";

/**
 * The exported social aura card: a PNG rendered on the server from the same
 * composition as the on-screen card. Portrait 4:5 for feeds; square for
 * everything else. This is the designed card itself, not a screenshot.
 */

const PAPER = "#f4f1ea";
const INK = "#2d2b29";
const INK_2 = "#5e5a54";
const INK_3 = "#8a857c";
const TERRACOTTA = "#c84b31";
const OLIVE = "#5c6340";

export type CardFormat = "portrait" | "square";

export const CARD_SIZES: Record<CardFormat, { width: number; height: number }> = {
  portrait: { width: 1080, height: 1350 },
  square: { width: 1080, height: 1080 },
};

function Motif({ motif, size }: { motif: Archetype["motif"]; size: number }) {
  const { paths, dot } = motifPath(motif);
  return (
    <svg width={size} height={size} viewBox="0 0 44 48" fill="none">
      {paths.map((d, i) => (
        <path key={i} d={d} stroke={OLIVE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      <circle cx={dot[0]} cy={dot[1]} r="3.2" fill={TERRACOTTA} />
    </svg>
  );
}

export async function auraCardImage(archetype: Archetype, format: CardFormat): Promise<ImageResponse> {
  const fonts = await loadOgFonts();
  const { width, height } = CARD_SIZES[format];
  const pad = 72;
  const nameSize = archetype.name.length > 22 ? 100 : 116;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: INK,
          padding: 48,
          fontFamily: "Instrument Sans",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: PAPER,
            color: INK,
            borderRadius: 40,
            padding: pad,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              right: 20,
              bottom: 20,
              border: `2px solid rgba(45,43,41,0.22)`,
              borderRadius: 28,
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 30 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Fraunces", fontWeight: 700, fontSize: 38 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M2.5 12H10.5M10.5 12L19.5 4.5M10.5 12L19.5 19.5" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="19.5" cy="4.5" r="2.1" fill={TERRACOTTA} />
              </svg>
              Instinct
            </div>
            <div style={{ color: OLIVE, fontWeight: 500 }}>Social aura</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <Motif motif={archetype.motif} size={format === "portrait" ? 150 : 120} />
            <div
              style={{
                fontFamily: "Fraunces",
                fontWeight: 700,
                fontSize: nameSize,
                lineHeight: 1.0,
                letterSpacing: -3,
                marginTop: 28,
                maxWidth: 900,
              }}
            >
              {archetype.name}
            </div>
            <div
              style={{
                fontFamily: "Fraunces",
                fontStyle: "italic",
                fontSize: 42,
                lineHeight: 1.25,
                color: INK_2,
                marginTop: 24,
                maxWidth: 900,
              }}
            >
              {archetype.headline}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 28, color: INK_2 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ width: 72, height: 6, background: TERRACOTTA, marginBottom: 16 }} />
              <div>Five situations. One gut instinct.</div>
              <div style={{ color: INK_3 }}>Which one are you?</div>
            </div>
            <div style={{ color: INK_3 }}>{SITE_HOST}</div>
          </div>
        </div>
      </div>
    ),
    { width, height, fonts },
  );
}
