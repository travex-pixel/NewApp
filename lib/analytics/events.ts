/**
 * Every analytics event the product sends, with its properties.
 * See ANALYTICS.md for definitions and where each fires.
 */

export type ChallengeType = "scenario" | "daily";
export type ShareMethod = "native" | "clipboard";
export type PlayMode = "round" | "challenge" | "daily";

export interface EventMap {
  landing_viewed: { referrer_host?: string };
  start_clicked: Record<string, never>;
  first_scenario_viewed: { scenario_id: string; category: string; mode: PlayMode };
  scenario_viewed: { scenario_id: string; category: string; mode: PlayMode; position: number };
  answer_selected: {
    scenario_id: string;
    category: string;
    choice_id: string;
    points: number;
    mode: PlayMode;
  };
  first_scenario_completed: { scenario_id: string; mode: PlayMode };
  three_scenarios_completed: { mode: PlayMode };
  five_scenarios_completed: { mode: PlayMode };
  session_completed: { points: number; max_points: number; round_number: number };
  challenge_created: { scenario_id: string; challenge_type: ChallengeType };
  share_attempted: { scenario_id: string; method: ShareMethod; challenge_type: ChallengeType };
  share_succeeded: { scenario_id: string; method: ShareMethod; challenge_type: ChallengeType };
  challenge_link_opened: { scenario_id: string; valid: boolean };
  challenge_completed: { scenario_id: string; same_choice: boolean };
  daily_challenge_completed: { scenario_id: string; date: string; points: number };
  return_visit: { days_since_last: number };
}

export type EventName = keyof EventMap;
