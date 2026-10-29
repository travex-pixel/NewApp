"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { Choice } from "@/lib/content";

export function AlternativePaths({
  chosen,
  others,
  onOpen,
  footer,
}: {
  chosen: Choice;
  others: Choice[];
  onOpen?: () => void;
  footer?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reduce = useReducedMotion();

  return (
    <div>
      <button
        type="button"
        className="drawer-toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) onOpen?.();
        }}
      >
        <span>See why the other paths might backfire</span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={id}
            key="body"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="drawer-body">
              {chosen.why ? (
                <p className="small muted pb-2" style={{ textWrap: "pretty" }}>
                  <span className="font-semibold" style={{ color: "var(--fg)" }}>Why this read. </span>
                  {chosen.why}
                </p>
              ) : null}
              {others.map((c) => (
                <div key={c.id} className="alt" style={{ display: "grid", gridTemplateColumns: "1.4rem 1fr", columnGap: "0.5rem" }}>
                  <span className="alt-key" aria-hidden="true" style={{ marginRight: 0, marginTop: "0.1rem" }}>
                    {c.id.toUpperCase()}
                  </span>
                  <div>
                    <p className="small" style={{ fontWeight: 500 }}>
                      <span className="sr-only">Option {c.id.toUpperCase()}: </span>
                      {c.text}
                    </p>
                    <p className="small muted mt-1">
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
              {footer ? <div className="pt-3">{footer}</div> : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
