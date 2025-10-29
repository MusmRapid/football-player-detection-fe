import { Trophy, ArrowUpRight, Activity, XCircle, Shield } from "lucide-react";
import type { EventItem } from "../../../types/analytics";
import SummaryCard from "../../SummaryCard";

function SummaryAndCounts({
  events,
  summaryPayload,
}: {
  events: EventItem[];
  summaryPayload: any;
}) {
  // --- Aggregate counts from events (fallback when backend summary is empty) ---
  const counts = events.reduce(
    (acc, e) => {
      const type = e.event_type?.toLowerCase();
      if (type === "goal") acc.goals++;
      if (type === "pass") acc.passes++;
      if (type === "tackle") acc.tackles++;
      if (type === "miss shot" || type === "missed shot") acc.missedShots++;
      if (type === "save" || type === "goal save") acc.saves++;
      return acc;
    },
    { goals: 0, passes: 0, tackles: 0, missedShots: 0, saves: 0 }
  );

  const totalGoals =
    (summaryPayload?.home?.total_goals ??
      summaryPayload?.away?.total_goals) ?? counts.goals;
  const totalPasses =
    (summaryPayload?.home?.total_passes ??
      summaryPayload?.away?.total_passes) ?? counts.passes;
  const totalTackles =
    (summaryPayload?.home?.total_tackles ??
      summaryPayload?.away?.total_tackles) ?? counts.tackles;
  const totalMissedShots =
    summaryPayload?.total_missed_shots ?? counts.missedShots;
  const totalSaves = summaryPayload?.total_saves ?? counts.saves;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-3">
      <SummaryCard
        title="Total Goals"
        value={totalGoals}
        accent="from-yellow-400/20 to-yellow-600/10"
        icon={<Trophy className="w-6 h-6 text-yellow-400" />}
      />
      <SummaryCard
        title="Total Passes"
        value={totalPasses}
        accent="from-blue-400/20 to-blue-600/10"
        icon={<ArrowUpRight className="w-6 h-6 text-blue-300" />}
      />
      <SummaryCard
        title="Total Tackles"
        value={totalTackles}
        accent="from-green-400/20 to-green-600/10"
        icon={<Activity className="w-6 h-6 text-green-300" />}
      />
      <SummaryCard
        title="Missed Shots"
        value={totalMissedShots}
        accent="from-red-400/20 to-red-600/10"
        icon={<XCircle className="w-6 h-6 text-red-400" />}
      />
      <SummaryCard
        title="Saves"
        value={totalSaves}
        accent="from-indigo-400/20 to-indigo-600/10"
        icon={<Shield className="w-6 h-6 text-indigo-400" />}
      />
    </div>
  );
}

export default SummaryAndCounts;
