import type { Choice, Science } from "@/lib/content";

/** The contents of the "other paths" sheet. */
export function OtherPaths({
  chosen,
  others,
  footer,
  science,
}: {
  chosen: Choice;
  others: Choice[];
  footer?: React.ReactNode;
  science?: Science;
}) {
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
