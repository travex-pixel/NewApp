"use client";

import { useState } from "react";
import { Copy, Download, Link2, Share2 } from "lucide-react";
import type { Archetype } from "@/lib/game/archetypes";
import { track } from "@/lib/analytics";
import type { ShareMethod } from "@/lib/analytics/events";
import { SITE_NAME } from "@/lib/site";

type Status = { kind: "idle" } | { kind: "busy"; what: string } | { kind: "done"; text: string } | { kind: "fail"; text: string };

/**
 * Real sharing, in order of preference: native share with the PNG card,
 * download of the same PNG, copy link, copy text. A cancelled share sheet
 * is neither a success nor a failure.
 */
export function ShareActions({ archetype }: { archetype: Archetype }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const slug = archetype.id;
  const resultUrl = () => `${window.location.origin}/r/${slug}`;
  const shareText = () => `I got ${archetype.name} on ${SITE_NAME}. "${archetype.headline}" Five situations, gut instinct. Which one are you? ${resultUrl()}`;

  function attempted(method: ShareMethod) {
    track("share_attempted", { method, archetype_id: slug });
  }
  function succeeded(method: ShareMethod) {
    track("share_succeeded", { method, archetype_id: slug });
  }

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
    if (status.kind === "busy") return;
    setStatus({ kind: "busy", what: "Preparing your card…" });
    let blob: Blob;
    try {
      blob = await fetchCard();
    } catch {
      setStatus({ kind: "fail", text: "Couldn't build the image. Try copying the link instead." });
      return;
    }
    const file = new File([blob], `instinct-${slug}.png`, { type: "image/png" });
    const payload: ShareData = { files: [file], title: `${archetype.name} · ${SITE_NAME}`, text: shareText() };

    const canNativeFiles =
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] });

    if (canNativeFiles) {
      attempted("native-image");
      try {
        await navigator.share(payload);
        succeeded("native-image");
        setStatus({ kind: "done", text: "Shared." });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setStatus({ kind: "idle" });
          return;
        }
        // Fall through to download.
      }
    }

    attempted("download");
    try {
      downloadBlob(blob);
      succeeded("download");
      setStatus({ kind: "done", text: "Saved your card as an image." });
    } catch {
      setStatus({ kind: "fail", text: "Couldn't save the image here. Copy the link instead." });
    }
  }

  async function download() {
    if (status.kind === "busy") return;
    setStatus({ kind: "busy", what: "Preparing your card…" });
    attempted("download");
    try {
      downloadBlob(await fetchCard());
      succeeded("download");
      setStatus({ kind: "done", text: "Saved your card as an image." });
    } catch {
      setStatus({ kind: "fail", text: "Couldn't save the image here." });
    }
  }

  async function copy(method: "copy-link" | "copy-text") {
    attempted(method);
    const text = method === "copy-link" ? resultUrl() : shareText();
    try {
      await navigator.clipboard.writeText(text);
      succeeded(method);
      setStatus({ kind: "done", text: method === "copy-link" ? "Link copied." : "Text copied." });
    } catch {
      setStatus({ kind: "fail", text: `Couldn't copy. Here it is: ${text}` });
    }
  }

  return (
    <div className="grid gap-2">
      <button type="button" className="btn btn-accent btn-block" onClick={shareImage} disabled={status.kind === "busy"}>
        <Share2 size={18} aria-hidden="true" />
        {status.kind === "busy" ? status.what : "Share your social aura"}
      </button>
      <div className="grid grid-cols-3 gap-2">
        <button type="button" className="btn btn-ghost btn-sm" onClick={download} disabled={status.kind === "busy"}>
          <Download size={16} aria-hidden="true" /> Image
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => copy("copy-link")}>
          <Link2 size={16} aria-hidden="true" /> Link
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => copy("copy-text")}>
          <Copy size={16} aria-hidden="true" /> Text
        </button>
      </div>
      <p className="small" role="status" aria-live="polite" style={{ color: status.kind === "fail" ? "var(--accent)" : "var(--fg-2)", minHeight: "1.3em", overflowWrap: "anywhere" }}>
        {status.kind === "done" || status.kind === "fail" ? status.text : ""}
      </p>
    </div>
  );
}
