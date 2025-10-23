export interface EventItem {
  event_id: string;
  event_type: "goal" | "pass" | "tackle" | string;
  player_jersey_number: string | null;
  player_name: string | null;
  start_time: number;
  end_time: number;
  bounding_box: number[]; // either relative [cx, cy, w, h] or absolute [x,y,w,h]
  confidence: number;
  notes?: string;
}

export interface TeamSummary {
  team_name?: string;
  total_goals?: number;
  total_passes?: number;
  total_tackles?: number;
}

export interface SummaryPayload {
  // backend used "summary": { "players": [] } earlier — we support both shapes
  players?: any[];
  home?: TeamSummary;
  away?: TeamSummary;
  // or custom shapes
  [k: string]: any;
}

export interface AnalyticsData {
  summary: SummaryPayload;
  per_event: EventItem[];
  notes?: string;
}
