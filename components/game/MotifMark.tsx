import type { Archetype } from "@/lib/game/archetypes";

/**
 * Six drawn marks, one per archetype motif. Same stroke, same weight, built
 * from the fork. Used on the card (DOM and PNG) and the result screen.
 */
export function motifPath(motif: Archetype["motif"]): { paths: string[]; dot: [number, number] } {
  switch (motif) {
    case "split":
      return { paths: ["M4 24H22", "M22 24L40 8", "M22 24L40 40"], dot: [40, 8] };
    case "merge":
      return { paths: ["M4 8L22 24", "M4 40L22 24", "M22 24H40"], dot: [40, 24] };
    case "straight":
      return { paths: ["M4 24H40"], dot: [40, 24] };
    case "loop":
      return { paths: ["M4 24H16", "M16 24C16 12 32 12 32 24C32 36 16 36 16 24", "M32 24H40"], dot: [40, 24] };
    case "pause":
      return { paths: ["M4 24H18", "M28 24H40"], dot: [23, 24] };
    case "leap":
      return { paths: ["M4 32H14", "M14 32C18 12 30 12 34 32", "M34 32H40"], dot: [24, 14] };
  }
}

export function MotifMark({
  motif,
  size = 48,
  stroke = "currentColor",
  dot = "var(--terracotta)",
  className,
}: {
  motif: Archetype["motif"];
  size?: number;
  stroke?: string;
  dot?: string;
  className?: string;
}) {
  const { paths, dot: [cx, cy] } = motifPath(motif);
  return (
    <svg width={size} height={size} viewBox="0 0 44 48" fill="none" className={className} aria-hidden="true">
      {paths.map((d, i) => (
        <path key={i} d={d} stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      <circle cx={cx} cy={cy} r="3.2" fill={dot} />
    </svg>
  );
}
