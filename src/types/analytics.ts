export interface Player {
  id: number;
  name: string;
  goals: number;
  passes: number;
  tackles: number;
}

export interface Summary {
  total_goals: number;
  total_passes: number;
  total_tackles: number;
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