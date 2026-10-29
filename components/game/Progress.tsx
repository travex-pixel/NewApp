export function Progress({ current, total, label }: { current: number; total: number; label?: string }) {
  const text = label ?? `${Math.min(current + 1, total)} of ${total}`;
  return (
    <div className="flex items-center gap-2.5" role="status" aria-live="polite" aria-atomic="true">
      <span className="small tabular muted">{text}</span>
      <span className="marks" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <i key={i} data-state={i < current ? "done" : i === current ? "current" : "ahead"} />
        ))}
      </span>
      <span className="sr-only">{`Situation ${Math.min(current + 1, total)} of ${total}`}</span>
    </div>
  );
}
