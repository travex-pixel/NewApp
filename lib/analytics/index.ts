"use client";

import { track as vercelTrack } from "@vercel/analytics";
import type { EventMap, EventName } from "./events";

/**
 * Analytics abstraction. Game code calls `track()` and never touches a
 * provider. Providers:
 *   - PostHog (product analytics), if NEXT_PUBLIC_POSTHOG_KEY is set.
 *   - Vercel Analytics custom events (always called; recorded only when the
 *     Vercel project has custom events enabled).
 *
 * Nothing here ever throws into the game. When no provider is configured,
 * events are logged to the console in development and dropped in production.
 */

type PostHogLike = {
  capture: (event: string, props?: Record<string, unknown>) => void;
  init: (key: string, opts: Record<string, unknown>) => void;
};

let posthog: PostHogLike | null = null;
let initPromise: Promise<void> | null = null;
const firedOnce = new Set<string>();

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

export function analyticsConfigured(): boolean {
  return Boolean(POSTHOG_KEY);
}

/** Lazy-load PostHog so it never blocks first paint. Idempotent. */
export function initAnalytics(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (initPromise) return initPromise;
  if (!POSTHOG_KEY) {
    initPromise = Promise.resolve();
    return initPromise;
  }
  initPromise = import("posthog-js")
    .then((mod) => {
      const ph = mod.default as unknown as PostHogLike;
      ph.init(POSTHOG_KEY as string, {
        api_host: POSTHOG_HOST,
        capture_pageview: true,
        capture_pageleave: true,
        persistence: "localStorage+cookie",
        autocapture: false,
        person_profiles: "identified_only",
      });
      posthog = ph;
    })
    .catch(() => {
      posthog = null;
    });
  return initPromise;
}

export function track<E extends EventName>(event: E, props: EventMap[E]): void {
  if (typeof window === "undefined") return;
  const payload = { ...(props as Record<string, unknown>) };
  try {
    if (posthog) posthog.capture(event, payload);
    else if (POSTHOG_KEY) void initAnalytics().then(() => posthog?.capture(event, payload));
  } catch {
    /* never let analytics break the game */
  }
  try {
    vercelTrack(event, payload as Record<string, string | number | boolean | null>);
  } catch {
    /* ignore */
  }
  if (process.env.NODE_ENV !== "production" && !POSTHOG_KEY) {
    console.debug("[analytics]", event, payload);
  }
}

/**
 * Fire an event at most once per page lifetime for a given key. Guards
 * funnel milestones against React re-renders and effect re-runs.
 */
export function trackOnce<E extends EventName>(key: string, event: E, props: EventMap[E]): void {
  if (firedOnce.has(key)) return;
  firedOnce.add(key);
  track(event, props);
}

export function referrerHost(): string | undefined {
  try {
    const ref = document.referrer;
    if (!ref) return undefined;
    const host = new URL(ref).hostname;
    return host === window.location.hostname ? undefined : host;
  } catch {
    return undefined;
  }
}
