"use client";

import { useEffect } from "react";
import { initAnalytics, track } from "@/lib/analytics";

const LAST_VISIT_KEY = "instinct:lastVisit";

/**
 * Boots the analytics providers after first paint and records return visits
 * (a visit at least one calendar day after the previous one, per device).
 */
export function AnalyticsProvider() {
  useEffect(() => {
    void initAnalytics();
    try {
      const now = Date.now();
      const raw = window.localStorage.getItem(LAST_VISIT_KEY);
      const last = raw ? Number(raw) : NaN;
      if (Number.isFinite(last)) {
        const days = Math.floor((now - last) / 86_400_000);
        if (days >= 1) track("return_visit", { days_since_last: days });
      }
      window.localStorage.setItem(LAST_VISIT_KEY, String(now));
    } catch {
      /* storage unavailable; nothing to record */
    }
  }, []);
  return null;
}
