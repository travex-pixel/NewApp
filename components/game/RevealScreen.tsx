"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Choice, Scenario } from "@/lib/content";
import { Wordmark } from "@/components/Wordmark";
import { AlternativePaths } from "./AlternativePaths";
import { GameShell } from "./GameShell";
import { Progress } from "./Progress";

const EASE = [0.16, 1, 0.3, 1] as const;

export function RevealScreen({
  scenario,
  choice,
  index,
  total,
  ctaLabel,
  onNext,
  challengerChoice,
  onDrawerOpen,
  drawerFooter,
  headRight,
}: {
  scenario: Scenario;
  choice: Choice;
  index: number;
  total: number;
  ctaLabel: string;
  onNext: () => void;
  /** Challenge mode: what the sender picked, shown only now. */
  challengerChoice?: Choice;
  onDrawerOpen?: () => void;
  drawerFooter?: React.ReactNode;
  headRight?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const others = scenario.choices.filter((c) => c.id !== choice.id);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // Move focus to the verdict for screen readers, without scrolling.
  useEffect(() => {
    const t = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), reduce ? 50 : 450);
    return () => window.clearTimeout(t);
  }, [reduce]);

  const item = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: EASE },
        };

  return (
    <GameShell
      theme="ink"
      head={
        <>
          <Wordmark />
          {headRight ?? <Progress current={index} total={total} />}
        </>
      }
      foot={
        <motion.button type="button" className="btn btn-block" onClick={onNext} {...item(0.55)}>
          {ctaLabel} <ArrowRight size={18} aria-hidden="true" />
        </motion.button>
      }
      aria-label="What happens"
    >
      <div className="centred">
        <motion.div {...item(0.12)}>
          <p className="small muted">You chose {choice.id.toUpperCase()}</p>
          <p className="serif mt-1" style={{ fontSize: "1.0625rem", lineHeight: 1.35, fontStyle: "italic", color: "var(--fg-2)", textWrap: "pretty" }}>
            {choice.text}
          </p>
        </motion.div>

        <motion.h2
          ref={headingRef}
          tabIndex={-1}
          className="display mt-4"
          style={{ fontSize: "clamp(1.5rem, 6.4vw, 1.9rem)", outline: "none" }}
          {...item(0.22)}
        >
          {choice.verdict}
        </motion.h2>
        {choice.tag ? (
          <motion.p className="small accent mt-2 font-semibold" {...item(0.28)}>
            {choice.tag}
          </motion.p>
        ) : null}

        {challengerChoice ? (
          <motion.p
            className="small mt-3 px-3 py-2"
            style={{ border: "1px solid var(--line)", borderRadius: "var(--r-sm)", color: "var(--fg-2)" }}
            {...item(0.32)}
          >
            {challengerChoice.id === choice.id ? (
              <>
                <span style={{ color: "var(--fg)", fontWeight: 600 }}>Same as your friend.</span> They chose {choice.id.toUpperCase()} too.
              </>
            ) : (
              <>
                <span style={{ color: "var(--fg)", fontWeight: 600 }}>Your friend chose {challengerChoice.id.toUpperCase()}.</span>{" "}
                <span className="serif" style={{ fontStyle: "italic" }}>{challengerChoice.text}</span>
              </>
            )}
          </motion.p>
        ) : null}

        <motion.div className="mt-4" {...item(0.38)}>
          <section className="consequence" aria-label="What it gets you">
            <p className="consequence-label">What it gets you</p>
            <ul>
              {choice.gets.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </section>
          <section className="consequence" aria-label="What it costs">
            <p className="consequence-label">What it costs</p>
            <ul>
              {choice.costs.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </section>
        </motion.div>

        <motion.div className="mt-3" {...item(0.48)}>
          <AlternativePaths chosen={choice} others={others} onOpen={onDrawerOpen} footer={drawerFooter} />
        </motion.div>
      </div>
    </GameShell>
  );
}
