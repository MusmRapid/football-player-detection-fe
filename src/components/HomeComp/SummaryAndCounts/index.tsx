
import { Trophy, ArrowUpRight, Activity } from "lucide-react";
import type { EventItem } from "../../../types/analytics";
import SummaryCard from "../../SummaryCard";


function SummaryAndCounts({
  events,
  summaryPayload,
}: {
  events: EventItem[];
  summaryPayload: any;
}) {
  // aggregate counts from events (fallback when backend summary is empty)
  const counts = events.reduce(
    (acc, e) => {
      if (e.event_type === "goal") acc.goals++;
      if (e.event_type === "pass") acc.passes++;
      if (e.event_type === "tackle") acc.tackles++;
      return acc;
    },
    { goals: 0, passes: 0, tackles: 0 }
  );

  const totalGoals =
    (summaryPayload?.home?.total_goals ?? summaryPayload?.away?.total_goals) ??
    counts.goals;
  const totalPasses =
    (summaryPayload?.home?.total_passes ?? summaryPayload?.away?.total_passes) ??
    counts.passes;
  const totalTackles =
    (summaryPayload?.home?.total_tackles ?? summaryPayload?.away?.total_tackles) ??
    counts.tackles;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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
    </div>
  );
}

export default SummaryAndCounts;