export interface Player {
  id: number;
  name: string;
  team: "home" | "away"; 
  goals: number;
  passes: number;
  tackles: number;
}

export interface TeamSummary {
  team_name: string;
  total_goals: number;
  total_passes: number;
  total_tackles: number;
}

export interface Summary {
  home: TeamSummary; 
  away: TeamSummary; 
}

export interface AnalyticsData {
  summary: Summary;
  players: Player[];
}

export interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;
}

export interface TeamTableProps {
  players: any[];
  color: "red" | "blue";
  title: string;
}

