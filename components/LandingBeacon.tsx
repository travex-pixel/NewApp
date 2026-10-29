"use client";

import { useEffect } from "react";
import { referrerHost, track, trackOnce } from "@/lib/analytics";

/** Fires landing_viewed once per page load, and start_clicked on the CTA. */
export function LandingBeacon() {
  useEffect(() => {
    trackOnce("landing_viewed", "landing_viewed", { referrer_host: referrerHost() });
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a[href="/play"]');
      if (link) track("start_clicked", {});
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
