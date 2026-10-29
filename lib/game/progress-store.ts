"use client";

import { useSyncExternalStore } from "react";
import { EMPTY_PROGRESS, type Progress } from "./engine";
import { loadProgress, saveProgress } from "./storage";

/**
 * A tiny external store over localStorage, so components read progress with
 * useSyncExternalStore: the server snapshot is empty, the client snapshot is
 * whatever the device has, and React handles the hydration hand-off.
 */

let snapshot: Progress | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function getSnapshot(): Progress {
  if (!snapshot) snapshot = loadProgress();
  return snapshot;
}

function getServerSnapshot(): Progress {
  return EMPTY_PROGRESS;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key && e.key.startsWith("instinct:")) {
      snapshot = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Persist and broadcast. Returns false when the device couldn't save. */
export function commitProgress(next: Progress): boolean {
  snapshot = next;
  const ok = saveProgress(next);
  emit();
  return ok;
}

export function readProgress(): Progress {
  return getSnapshot();
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noop = () => () => {};

/** False during server render and hydration, true once the client has taken over. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
