/**
 * Every analytics event the product sends, with its properties.
 * See ANALYTICS.md for definitions and where each fires.
 */

export type PlayMode = "round" | "challenge";
export type ShareMethod = "native-image" | "download" | "copy-link" | "copy-text" | "native" | "clipboard";

export interface EventMap {
  landing_viewed: { referrer_host?: string };
  start_clicked: Record<string, never>;
  scenario_viewed: { scenario_id: string; category: string; mode: PlayMode; position: number };
  answer_selected: { scenario_id: string; category: string; choice_id: string; mode: PlayMode; position: number };
  drawer_opened: { scenario_id: string; mode: PlayMode };
  round_completed: { archetype_id: string; round_index: number; date: string };
  result_viewed: { archetype_id: string };
  play_again: { round_index: number };
  share_attempted: { method: ShareMethod; archetype_id?: string; scenario_id?: string };
  share_succeeded: { method: ShareMethod; archetype_id?: string; scenario_id?: string };
  challenge_created: { scenario_id: string };
  challenge_link_opened: { scenario_id: string; valid: boolean };
  challenge_completed: { scenario_id: string; same_choice: boolean };
  return_visit: { days_since_last: number };
}

export type EventName = keyof EventMap;
