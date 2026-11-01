"use client";

import { useEffect } from "react";
import { trackOnce } from "@/lib/analytics";

export function DuelBeacon({ valid }: { valid: boolean }) {
  useEffect(() => {
    trackOnce("duel_opened", "duel_link_opened", { valid });
  }, [valid]);
  return null;
}
