"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Layers, Lightbulb } from "lucide-react";
import type { Choice, Scenario } from "@/lib/content";
import { DialChips } from "./DialChips";
import { GameHeader } from "./GameHeader";
import { GameShell } from "./GameShell";
import { OtherPaths } from "./OtherPaths";
import { Progress } from "./Progress";
import { Sheet } from "./Sheet";

const EASE = [0.16, 1, 0.3, 1] as const;

export function RevealScreen({
  scenario,
  choice,
  index,
  total,
  ctaLabel,
  onNext,
  challengerChoice,
  onPathsOpen,
  pathsFooter,
  headRight,
}: {
  scenario: Scenario;
  choice: Choice;
  index: number;
  total: number;
  ctaLabel: string;
  onNext: () => void;
  challengerChoice?: Choice;
  onPathsOpen?: () => void;
  pathsFooter?: React.ReactNode;
  headRight?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const [paths, setPaths] = useState(false);
  const others = scenario.choices.filter((c) => c.id !== choice.id);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), reduce ? 50 : 450);
    return () => window.clearTimeout(t);
  }, [reduce]);

  const item = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: EASE },
        };

  return (
    <GameShell
      theme="ink"
      head={<GameHeader right={headRight ?? <Progress current={index} total={total} />} />}
      foot={
        <>
          <motion.button
            type="button"
            className="btn btn-ghost btn-sm btn-block"
            onClick={() => {
              setPaths(true);
              onPathsOpen?.();
            }}
            {...item(0.5)}
          >
            {scenario.science ? (
              <>
                <Lightbulb size={16} aria-hidden="true" />
                <span>
                  Behind it: <span className="font-semibold">{scenario.science.name}</span>
                </span>
              </>
            ) : (
              <>
                <Layers size={16} aria-hidden="true" /> See how the other answers play out
              </>
            )}
          </motion.button>
          <motion.button type="button" className="btn btn-block" onClick={onNext} {...item(0.6)}>
            {ctaLabel} <ArrowRight size={18} aria-hidden="true" />
          </motion.button>
        </>
      }
      aria-label="What happens"
    >
      <div className="centred">
        <motion.div {...item(0.1)}>
          <p className="small muted">You chose {choice.id.toUpperCase()}</p>
          <p
            className={`serif mt-1 reveal-echo ${challengerChoice ? "hidden" : ""}`}
            style={{
              fontSize: "1rem",
              lineHeight: 1.35,
              fontStyle: "italic",
              color: "var(--fg-2)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {choice.text}
          </p>
        </motion.div>

        <motion.h2
          ref={headingRef}
          tabIndex={-1}
          className="display fit-verdict mt-3"
          style={{ outline: "none" }}
          initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.2, ease: EASE }}
        >
          {choice.verdict}
        </motion.h2>

        <motion.div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2" {...item(0.32)}>
          {choice.tag ? <span className="small accent font-semibold">{choice.tag}</span> : null}
          <DialChips choice={choice} />
        </motion.div>

        {challengerChoice ? (
          <motion.p className="small mt-2" style={{ color: "var(--fg-2)" }} {...item(0.36)}>
            {challengerChoice.id === choice.id ? (
              <>
                <span style={{ color: "var(--fg)", fontWeight: 600 }}>Same as your friend.</span> They chose {choice.id.toUpperCase()} too.
              </>
            ) : (
              <>
                <span style={{ color: "var(--fg)", fontWeight: 600 }}>Your friend chose {challengerChoice.id.toUpperCase()}</span>
                {challengerChoice.tag ? <span> · {challengerChoice.tag}</span> : null}
              </>
            )}
          </motion.p>
        ) : null}

        <div className="mt-3.5">
          <motion.section className="panel" aria-label="What it gets you" {...item(0.4)}>
            <p className="label">What it gets you</p>
            <ul>
              {(challengerChoice ? choice.gets.slice(0, 1) : choice.gets).map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </motion.section>
          <motion.section className="panel" aria-label="What it costs" {...item(0.46)}>
            <p className="label" style={{ color: "var(--accent)" }}>
              What it costs
            </p>
            <ul>
              {(challengerChoice ? choice.costs.slice(0, 1) : choice.costs).map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </motion.section>
        </div>
      </div>

      <Sheet open={paths} onClose={() => setPaths(false)} title={scenario.science ? "Behind it" : "The other answers"} theme="ink">
        <OtherPaths chosen={choice} others={others} footer={pathsFooter} science={scenario.science} />
      </Sheet>
    </GameShell>
  );
}
