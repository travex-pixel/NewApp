import { Lock } from "lucide-react";
import { ARCHETYPE_IDS, ARCHETYPES } from "@/lib/game/archetypes";
import { MotifMark } from "./MotifMark";

/** Every aura there is, the ones you've found lit up. */
export function AuraCollection({ found, current }: { found: Set<string>; current?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="label">Auras found</p>
        <p className="small tabular muted">
          {found.size} of {ARCHETYPE_IDS.length}
        </p>
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-1.5">
        {ARCHETYPE_IDS.map((id) => {
          const a = ARCHETYPES[id];
          const have = found.has(id);
          return (
            <li
              key={id}
              className="flex items-center gap-2 small"
              style={{
                padding: "0.45rem 0.55rem",
                borderRadius: "var(--r-sm)",
                background: have ? "var(--bg-2)" : "transparent",
                border: `1px ${have ? "solid" : "dashed"} var(--line)`,
                color: have ? "var(--fg)" : "var(--fg-3)",
                outline: id === current ? "2px solid var(--accent)" : undefined,
                outlineOffset: -1,
              }}
            >
              {have ? (
                <MotifMark motif={a.motif} size={20} stroke="var(--accent-2)" dot="var(--accent)" />
              ) : (
                <Lock size={14} aria-hidden="true" style={{ flex: "none", margin: "0 3px" }} />
              )}
              <span style={{ lineHeight: 1.2 }}>{a.name.replace(/^The /, "")}</span>
              <span className="sr-only">{have ? "found" : "not found yet"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
