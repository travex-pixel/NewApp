import type { Archetype } from "@/lib/game/archetypes";
import { ForkMark } from "@/components/ForkMark";
import { SITE_HOST } from "@/lib/site";
import { MotifMark } from "./MotifMark";

/**
 * The on-screen social aura card. A 4:5 editorial collectible in paper and
 * ink. The exported PNG (lib/aura-image.tsx) mirrors this composition.
 */
export function AuraCard({ archetype, className = "" }: { archetype: Archetype; className?: string }) {
  return (
    <div className={`aura-card ${className}`} data-archetype={archetype.id}>
      <div className="flex items-center justify-between" style={{ fontSize: "0.8125rem" }}>
        <span className="inline-flex items-center gap-1.5 serif" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
          <ForkMark size={15} /> Instinct
        </span>
        <span style={{ color: "var(--olive)", fontWeight: 600 }}>Social aura</span>
      </div>

      <div className="mt-auto">
        <MotifMark motif={archetype.motif} size={56} stroke="var(--olive)" dot="var(--terracotta)" />
        <p className="display mt-3" style={{ fontSize: "1.9rem", lineHeight: 1.02, fontWeight: 600, letterSpacing: "-0.025em" }}>
          {archetype.name}
        </p>
        <p className="serif mt-2.5" style={{ fontStyle: "italic", fontSize: "1.0625rem", lineHeight: 1.3, color: "var(--ink-2)", textWrap: "pretty" }}>
          {archetype.headline}
        </p>
      </div>

      <div className="mt-auto pt-4 flex items-end justify-between gap-3" style={{ fontSize: "0.75rem", color: "var(--ink-2)" }}>
        <div>
          <div style={{ width: 28, height: 3, background: "var(--terracotta)", marginBottom: 6 }} />
          <div>Five situations. One gut instinct.</div>
          <div style={{ color: "var(--ink-3)" }}>Which one are you?</div>
        </div>
        <div className="tabular" style={{ color: "var(--ink-3)" }}>{SITE_HOST}</div>
      </div>
    </div>
  );
}
