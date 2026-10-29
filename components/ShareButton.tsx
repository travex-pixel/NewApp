"use client";

import { useState } from "react";
import { track, trackOnce } from "@/lib/analytics";
import type { ChallengeType } from "@/lib/analytics/events";
import type { Choice } from "@/lib/content";
import { challengePath, encodeChallenge } from "@/lib/game/challenge";
import { SITE_NAME } from "@/lib/site";

type State = "idle" | "working" | "shared" | "copied" | "manual";

export function ShareButton({
  scenarioId,
  choiceId,
  challengeType,
  label = "Challenge a friend with this one",
  className = "btn btn-ghost btn-block",
  shareText,
}: {
  scenarioId: string;
  choiceId: Choice["id"];
  challengeType: ChallengeType;
  label?: string;
  className?: string;
  shareText?: string;
}) {
  const [state, setState] = useState<State>("idle");
  const [url, setUrl] = useState<string | null>(null);

  const code = encodeChallenge(scenarioId, choiceId);
  if (!code) return null;

  async function share() {
    if (state === "working") return;
    setState("working");
    const link = `${window.location.origin}${challengePath(code!)}`;
    setUrl(link);
    trackOnce(`challenge:${code}`, "challenge_created", {
      scenario_id: scenarioId,
      challenge_type: challengeType,
    });

    const text =
      shareText ?? "I've answered this one. I want to see what you'd do.";
    const payload = { title: SITE_NAME, text, url: link };

    const canNative =
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      (typeof navigator.canShare !== "function" || navigator.canShare(payload));

    if (canNative) {
      track("share_attempted", { scenario_id: scenarioId, method: "native", challenge_type: challengeType });
      try {
        await navigator.share(payload);
        track("share_succeeded", { scenario_id: scenarioId, method: "native", challenge_type: challengeType });
        setState("shared");
        return;
      } catch (err) {
        // User dismissed the sheet: not a failure, not a success.
        if (err instanceof Error && err.name === "AbortError") {
          setState("idle");
          return;
        }
        // Anything else: fall through to the clipboard.
      }
    }

    track("share_attempted", { scenario_id: scenarioId, method: "clipboard", challenge_type: challengeType });
    try {
      await navigator.clipboard.writeText(link);
      track("share_succeeded", { scenario_id: scenarioId, method: "clipboard", challenge_type: challengeType });
      setState("copied");
    } catch {
      setState("manual");
    }
  }

  const text =
    state === "shared"
      ? "Sent"
      : state === "copied"
        ? "Link copied"
        : state === "working"
          ? "Opening share…"
          : label;

  return (
    <div className="grid gap-2">
      <button type="button" className={className} onClick={share} aria-live="polite">
        {text}
      </button>
      {state === "manual" && url ? (
        <label className="small" style={{ color: "var(--fg-2)" }}>
          Couldn&rsquo;t copy automatically. Here&rsquo;s the link:
          <input
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-1 w-full rounded-md px-3 py-2"
            style={{ border: "1px solid var(--line)", background: "transparent", color: "var(--fg)" }}
          />
        </label>
      ) : null}
    </div>
  );
}
