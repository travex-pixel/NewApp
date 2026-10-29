export function Meter({
  total,
  current,
  label,
}: {
  total: number;
  /** Zero-based index of the current situation. Pass total when finished. */
  current: number;
  label?: string;
}) {
  const text = label ?? `Situation ${Math.min(current + 1, total)} of ${total}`;
  return (
    <div className="flex items-center gap-3">
      <span className="small tabular meter-label" style={{ color: "var(--fg-2)", whiteSpace: "nowrap" }}>
        {text}
      </span>
      <span className="meter" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Math.min(current, total)} aria-label={text}>
        {Array.from({ length: total }, (_, i) => (
          <i key={i} data-on={i < current} data-current={i === current} />
        ))}
      </span>
    </div>
  );
}
