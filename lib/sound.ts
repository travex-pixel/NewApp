"use client";

import { useSyncExternalStore } from "react";

/**
 * Sound and haptics, synthesised with Web Audio so there are no files to
 * load. Quiet by design. On iPhone, Web Audio follows the silent switch, so
 * a muted phone stays muted. Players can turn it off; the choice is saved.
 */

const KEY = "instinct:sound";
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let echo: DelayNode | null = null;
const listeners = new Set<() => void>();

function readEnabled(): boolean {
  try {
    return window.localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

let enabledCache: boolean | null = null;
function enabled(): boolean {
  if (enabledCache === null) enabledCache = readEnabled();
  return enabledCache;
}

export function setSoundEnabled(on: boolean) {
  enabledCache = on;
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* unavailable */
  }
  for (const l of listeners) l();
  if (on) play.tap();
}

export function useSoundEnabled(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    enabled,
    () => true,
  );
}

function audio(): AudioContext | null {
  if (typeof window === "undefined" || !enabled()) return null;
  try {
    if (!ctx) {
      const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      master = ctx.createGain();
      master.gain.value = 0.32;
      master.connect(ctx.destination);
      // A short, soft echo gives the bells some room.
      echo = ctx.createDelay(0.5);
      echo.delayTime.value = 0.16;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.22;
      const wet = ctx.createGain();
      wet.gain.value = 0.35;
      echo.connect(feedback).connect(echo);
      echo.connect(wet).connect(master);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, at: number, dur: number, type: OscillatorType = "sine", vol = 0.15, toEcho = false) {
  const c = audio();
  if (!c || !master) return;
  const t = c.currentTime + at;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master);
  if (toEcho && echo) g.connect(echo);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function swoosh(at: number, dur: number, from: number, to: number, vol = 0.05) {
  const c = audio();
  if (!c || !master) return;
  const t = c.currentTime + at;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(g).connect(master);
  src.start(t);
  src.stop(t + dur + 0.05);
}

export const play = {
  tap() {
    tone(880, 0, 0.07, "triangle", 0.06);
  },
  select() {
    tone(523.25, 0, 0.14, "sine", 0.12);
    tone(783.99, 0.07, 0.22, "sine", 0.1, true);
  },
  reveal() {
    swoosh(0, 0.42, 280, 2200, 0.05);
    tone(196, 0.08, 0.9, "sine", 0.1);
    tone(392, 0.16, 0.7, "triangle", 0.035, true);
  },
  next() {
    swoosh(0, 0.22, 1800, 600, 0.03);
    tone(659.25, 0.02, 0.1, "triangle", 0.05);
  },
  tick(i: number) {
    tone(988 + i * 110, 0, 0.09, "sine", 0.06, true);
  },
  aura() {
    const notes = [261.63, 392, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => tone(f, i * 0.085, 1.6 - i * 0.12, i % 2 ? "triangle" : "sine", 0.09, true));
    tone(130.81, 0, 2.2, "sine", 0.1);
  },
};

export function buzz(pattern: number | number[] = 10) {
  try {
    if (enabled() && typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
  } catch {
    /* unsupported */
  }
}
