import type { Choice, Science } from "@/lib/content";
import { shareOf, totalVotes, type Counts } from "@/lib/crowd";

/** The contents of the "other paths" sheet. */
export function OtherPaths({
  chosen,
  others,
  footer,
  science,
  crowd,
}: {
  chosen: Choice;
  others: Choice[];
  footer?: React.ReactNode;
  science?: Science;
  crowd?: Counts | null;
}) {
  const hasCrowd = shareOf(crowd, chosen.id) !== null;
  return (
    <div className="grid gap-3">
      {science ? (
        <section className="panel" aria-label="The psychology">
          <p className="label">The psychology</p>
          <p className="display mt-1" style={{ fontSize: "1.25rem" }}>
            {science.name}
          </p>
          <p className="mt-1.5 muted" style={{ textWrap: "pretty" }}>
            {science.line}
          </p>
          <p className="tiny faint mt-2">{science.source}</p>
        </section>
      ) : null}
      {chosen.why ? (
        <p className="muted" style={{ textWrap: "pretty" }}>
          <span className="font-semibold" style={{ color: "var(--fg)" }}>
            Why this read.{" "}
          </span>
          {chosen.why}
        </p>
      ) : null}
      {hasCrowd && crowd ? (
        <section className="panel" aria-label="What everyone picked">
          <p className="label">What everyone picked</p>
          <ul className="bars mt-2 grid gap-1.5">
            {(["a", "b", "c", "d"] as const).map((id) => {
              const pct = shareOf(crowd, id) ?? 0;
              const me = id === chosen.id;
              return (
                <li key={id} className="flex items-center gap-2 small" style={{ paddingLeft: 0 }}>
                  <span className="font-semibold tabular" style={{ width: "1.2rem", color: me ? "var(--accent)" : "var(--fg-2)" }}>
                    {id.toUpperCase()}
                  </span>
                  <span style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--bg-2)", overflow: "hidden" }} aria-hidden="true">
                    <span style={{ display: "block", height: "100%", width: `${pct}%`, background: me ? "var(--accent)" : "var(--accent-2)", borderRadius: 4 }} />
                  </span>
                  <span className="tabular" style={{ width: "2.6rem", textAlign: "right", color: me ? "var(--fg)" : "var(--fg-2)" }}>
                    {pct}%
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="tiny faint mt-2">From {totalVotes(crowd).toLocaleString("en-AU")} anonymous answers. One per phone.</p>
        </section>
      ) : null}
      <p className="label mt-1">The other answers</p>
      {others.map((c) => (
        <div key={c.id} className="panel" style={{ display: "grid", gridTemplateColumns: "1.7rem 1fr", columnGap: "0.6rem" }}>
          <span className="option-key" aria-hidden="true" style={{ width: "1.7rem", height: "1.7rem", fontSize: "0.75rem" }}>
            {c.id.toUpperCase()}
          </span>
          <div>
            <p style={{ fontWeight: 500, lineHeight: 1.35 }}>
              <span className="sr-only">Option {c.id.toUpperCase()}: </span>
              {c.text}
            </p>
            <p className="display mt-1.5" style={{ fontSize: "1.0625rem", lineHeight: 1.25 }}>
              {c.verdict}
            </p>
            <p className="small muted mt-1.5">
              <span className="olive font-semibold">Upside. </span>
              {c.gets[0]}
            </p>
            <p className="small muted mt-0.5">
              <span className="accent font-semibold">Downside. </span>
              {c.costs[0]}
            </p>
          </div>
        </div>
      ))}
      {footer ? <div className="pt-1">{footer}</div> : null}
    </div>
  );
}
