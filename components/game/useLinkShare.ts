"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { SITE_NAME } from "@/lib/site";

/**
 * Share a link: native share sheet where available, otherwise copy to the
 * clipboard, otherwise show it so it can be copied by hand. A cancelled
 * share sheet counts as neither success nor failure.
 */
export function useLinkShare() {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const say = useCallback((text: string) => {
    setToast(text);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);
  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const shareLink = useCallback(
    async (path: string, text: string) => {
      const url = `${window.location.origin}${path}`;
      const payload = { title: SITE_NAME, text, url };
      const canNative =
        typeof navigator.share === "function" && (typeof navigator.canShare !== "function" || navigator.canShare(payload));
      if (canNative) {
        track("share_attempted", { method: "native" });
        try {
          await navigator.share(payload);
          track("share_succeeded", { method: "native" });
          say("Sent");
          return;
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return;
        }
      }
      track("share_attempted", { method: "clipboard" });
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        track("share_succeeded", { method: "clipboard" });
        say("Link copied. Paste it to a friend");
      } catch {
        say(`Copy this link: ${url}`);
      }
    },
    [say],
  );

  return { toast, shareLink };
}
