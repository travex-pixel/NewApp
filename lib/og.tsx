import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared composition for social preview images. Ink ground, paper type, one
 * accent. Fonts are the self-hosted .woff files in app/fonts (Satori reads
 * woff, not woff2).
 */

type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 500 | 700; style: "normal" | "italic" };

let cached: OgFont[] | null = null;

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export async function loadOgFonts(): Promise<OgFont[]> {
  if (cached) return cached;
  const dir = join(process.cwd(), "app", "fonts");
  const [display, displayItalic, sans] = await Promise.all([
    readFile(join(dir, "fraunces-latin-700-normal.woff")),
    readFile(join(dir, "fraunces-latin-400-italic.woff")),
    readFile(join(dir, "instrument-sans-latin-500-normal.woff")),
  ]);
  cached = [
    { name: "Fraunces", data: toArrayBuffer(display), weight: 700, style: "normal" },
    { name: "Fraunces", data: toArrayBuffer(displayItalic), weight: 400, style: "italic" },
    { name: "Instrument Sans", data: toArrayBuffer(sans), weight: 500, style: "normal" },
  ];
  return cached;
}

const INK = "#1b1917";
const PAPER = "#f3eee4";
const PAPER_2 = "#b9b1a3";
const SIGNAL = "#f0623a";

export function OgFrame({
  kicker,
  title,
  body,
  footer,
}: {
  kicker?: string;
  title: string;
  body: string;
  footer: string;
}) {
  const bodyText = body.length > 150 ? body.slice(0, 147).trimEnd() + "…" : body;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: INK,
        color: PAPER,
        fontFamily: "Instrument Sans",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M2.5 12H10.5M10.5 12L19.5 4.5M10.5 12L19.5 19.5" stroke={PAPER} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="19.5" cy="4.5" r="2.1" fill={SIGNAL} />
          </svg>
          <div style={{ fontFamily: "Fraunces", fontSize: 36, fontWeight: 700, letterSpacing: -0.8 }}>Instinct</div>
        </div>
        {kicker ? <div style={{ fontSize: 26, color: PAPER_2 }}>{kicker}</div> : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontFamily: "Fraunces",
            fontSize: title.length > 34 ? 68 : 84,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 32, lineHeight: 1.3, color: PAPER_2, maxWidth: 980 }}>
          {bodyText}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26, color: PAPER_2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 3, background: SIGNAL }} />
          <div>{footer}</div>
        </div>
      </div>
    </div>
  );
}
