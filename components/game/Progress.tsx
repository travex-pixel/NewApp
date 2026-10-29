export function Progress({ current, total }: { current: number; total: number }) {
  const n = Math.min(current + 1, total);
  return (
    <div className="flex items-center gap-2.5" role="status" aria-live="polite" aria-atomic="true">
      <span className="small tabular muted progress-text" aria-hidden="true">
        {n} of {total}
      </span>
      <span className="marks" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <i key={i} data-state={i < current ? "done" : i === current ? "current" : "ahead"} />
        ))}
      </span>
      <span className="sr-only">{`Situation ${n} of ${total}`}</span>
    </div>
  );
}
