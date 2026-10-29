"use client";

import { useState } from "react";
import { track, trackOnce } from "@/lib/analytics";
import type { Choice } from "@/lib/content";
import { challengePath, encodeChallenge } from "@/lib/game/challenge";
import { SITE_NAME } from "@/lib/site";

type State = "idle" | "working" | "shared" | "copied" | "manual";

/**
 * Sends one situation to a friend as a challenge link. The player's own
 * answer travels inside the link and stays hidden until the friend answers.
 */
export function ShareButton({
  scenarioId,
  choiceId,
  label = "Send this situation to a friend",
  className = "btn btn-ghost btn-block",
  shareText,
}: {
  scenarioId: string;
  choiceId: Choice["id"];
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
    trackOnce(`challenge:${code}`, "challenge_created", { scenario_id: scenarioId });

    const text = shareText ?? "I've answered this one. I want to see what you'd do.";
    const payload = { title: SITE_NAME, text, url: link };
    const canNative =
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      (typeof navigator.canShare !== "function" || navigator.canShare(payload));

    if (canNative) {
      track("share_attempted", { method: "native", scenario_id: scenarioId });
      try {
        await navigator.share(payload);
        track("share_succeeded", { method: "native", scenario_id: scenarioId });
        setState("shared");
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setState("idle");
          return;
        }
      }
    }

    track("share_attempted", { method: "clipboard", scenario_id: scenarioId });
    try {
      await navigator.clipboard.writeText(link);
      track("share_succeeded", { method: "clipboard", scenario_id: scenarioId });
      setState("copied");
    } catch {
      setState("manual");
    }
  }

  const text = state === "shared" ? "Sent" : state === "copied" ? "Link copied" : state === "working" ? "Opening share…" : label;

  return (
    <div className="grid gap-2">
      <button type="button" className={className} onClick={share} aria-live="polite">
        {text}
      </button>
      {state === "manual" && url ? (
        <label className="small muted">
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
