"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Archetype } from "@/lib/game/archetypes";
import { track } from "@/lib/analytics";
import type { ShareMethod } from "@/lib/analytics/events";
import { SITE_NAME } from "@/lib/site";

/**
 * Real sharing, in order of preference: native share with the PNG card,
 * download of the same PNG, copy link, copy text. A cancelled share sheet
 * is neither a success nor a failure.
 */
export function useShare(archetype: Archetype) {
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const slug = archetype.id;

  const say = useCallback((text: string) => {
    setToast(text);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);
  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const resultUrl = () => `${window.location.origin}/r/${slug}`;
  const shareText = () => `I got ${archetype.name} on ${SITE_NAME}. "${archetype.headline}" Five situations, gut instinct. Which one are you? ${resultUrl()}`;
  const attempted = (method: ShareMethod) => track("share_attempted", { method, archetype_id: slug });
  const succeeded = (method: ShareMethod) => track("share_succeeded", { method, archetype_id: slug });

  async function fetchCard(): Promise<Blob> {
    const res = await fetch(`/r/${slug}/card`, { cache: "force-cache" });
    if (!res.ok) throw new Error(`card ${res.status}`);
    return res.blob();
  }

  function downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `instinct-${slug}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  async function shareImage() {
    if (busy) return;
    setBusy(true);
    try {
      let blob: Blob;
      try {
        blob = await fetchCard();
      } catch {
        say("Couldn't make the image. Try copying the link.");
        return;
      }
      const file = new File([blob], `instinct-${slug}.png`, { type: "image/png" });
      const canFiles =
        typeof navigator.share === "function" && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });
      if (canFiles) {
        attempted("native-image");
        try {
          await navigator.share({ files: [file], title: `${archetype.name} · ${SITE_NAME}`, text: shareText() });
          succeeded("native-image");
          say("Shared");
          return;
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return;
        }
      }
      attempted("download");
      downloadBlob(blob);
      succeeded("download");
      say("Saved your card as an image");
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    if (busy) return;
    setBusy(true);
    attempted("download");
    try {
      downloadBlob(await fetchCard());
      succeeded("download");
      say("Saved your card as an image");
    } catch {
      say("Couldn't save the image here");
    } finally {
      setBusy(false);
    }
  }

  async function copy(method: "copy-link" | "copy-text") {
    attempted(method);
    const text = method === "copy-link" ? resultUrl() : shareText();
    try {
      await navigator.clipboard.writeText(text);
      succeeded(method);
      say(method === "copy-link" ? "Link copied" : "Copied, ready to paste");
    } catch {
      say(`Couldn't copy. ${text}`);
    }
  }

  return { busy, toast, shareImage, download, copyLink: () => copy("copy-link"), copyText: () => copy("copy-text") };
}
