"use client";

import { useEffect } from "react";
import { trackOnce } from "@/lib/analytics";

export function ChallengeBeacon({ scenarioId, valid }: { scenarioId: string; valid: boolean }) {
  useEffect(() => {
    trackOnce(`challenge_opened:${scenarioId}`, "challenge_link_opened", { scenario_id: scenarioId, valid });
  }, [scenarioId, valid]);
  return null;
}
