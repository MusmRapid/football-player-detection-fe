import {
  Trophy,
  ArrowUpRight,
  Activity,
  XCircle,
  Shield,
  CornerUpRight,
  Target,
  Goal,
} from "lucide-react";
import type { EventItem } from "../../../types/analytics";
import SummaryCard from "../../SummaryCard";

function SummaryAndCounts({
  events,
  summaryPayload,
}: {
  events: EventItem[];
  summaryPayload: any;
}) {
  const counts = events.reduce(
    (acc, e) => {
      const type = e.event_type?.toLowerCase() || "";
      const note = e.notes?.toLowerCase() || "";

      if (type === "goal") acc.goals++;
      if (type === "pass") acc.passes++;
      if (type === "tackle") acc.tackles++;
      if (type === "corner" || note.includes("corner")) acc.corners++;
      if (type === "freekick" || note.includes("free kick")) acc.freekicks++;
      if (type === "miss shot" || type === "missed shot") acc.missedShots++;
      if (type === "save" || type === "goal save") acc.saves++;

      if (
        type === "penalty" ||
        note.includes("penalty") ||
        (type === "goal" && note.includes("penalty")) ||
        (type === "save" && note.includes("penalty")) ||
        (type === "miss shot" && note.includes("penalty"))
      ) {
        acc.penalties++;
      }

      return acc;
    },
    {
      goals: 0,
      passes: 0,
      tackles: 0,
      corners: 0,
      freekicks: 0,
      missedShots: 0,
      saves: 0,
      penalties: 0,
    }
  );

  const totalGoals =
    summaryPayload?.total_goals ??
    summaryPayload?.home?.total_goals ??
    summaryPayload?.away?.total_goals ??
    counts.goals;
  const totalPasses =
    summaryPayload?.total_passes ??
    summaryPayload?.home?.total_passes ??
    summaryPayload?.away?.total_passes ??
    counts.passes;
  const totalTackles =
    summaryPayload?.total_tackles ??
    summaryPayload?.home?.total_tackles ??
    summaryPayload?.away?.total_tackles ??
    counts.tackles;
  const totalMissedShots =
    summaryPayload?.total_missed_shots ?? counts.missedShots;
  const totalSaves = summaryPayload?.total_saves ?? counts.saves;
  const totalCorners = summaryPayload?.total_corners ?? counts.corners;
  const totalFreekicks = summaryPayload?.total_freekicks ?? counts.freekicks;
  const totalPenalties = summaryPayload?.total_penalties ?? counts.penalties;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      <SummaryCard
        title="Goals"
        value={totalGoals}
        accent="from-yellow-400/20 to-yellow-600/10"
        icon={<Trophy className="w-6 h-6 text-yellow-400" />}
      />
      <SummaryCard
        title="Passes"
        value={totalPasses}
        accent="from-blue-400/20 to-blue-600/10"
        icon={<ArrowUpRight className="w-6 h-6 text-blue-300" />}
      />
      <SummaryCard
        title="Tackles"
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
      <SummaryCard
        title="Corners"
        value={totalCorners}
        accent="from-orange-400/20 to-orange-600/10"
        icon={<CornerUpRight className="w-6 h-6 text-orange-400" />}
      />
      <SummaryCard
        title="Free Kicks"
        value={totalFreekicks}
        accent="from-purple-400/20 to-purple-600/10"
        icon={<Goal className="w-6 h-6 text-purple-400" />}
      />
      <SummaryCard
        title="Penalties"
        value={totalPenalties}
        accent="from-pink-400/20 to-pink-600/10"
        icon={<Target className="w-6 h-6 text-pink-400" />}
      />
    </div>
  );
}

export default SummaryAndCounts;
