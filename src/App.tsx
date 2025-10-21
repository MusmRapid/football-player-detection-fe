import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, ArrowUpRight, Activity } from "lucide-react";
import Loader from "./components/Loader";
import SummaryCard from "./components/SummaryCard";
import TeamTable from "./components/Tables/TeamTable";
import type { AnalyticsData } from "./types/analytics";

const FootballAnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch("/analytics.json")
      .then((res) => res.json())
      .then((json: AnalyticsData) => setData(json))
      .catch((err) => console.error("Error loading analytics:", err));
  }, []);

  if (!data) return <Loader />;

  const { summary, players } = data;
  const homePlayers = players.filter((p) => p.team === "home");
  const awayPlayers = players.filter((p) => p.team === "away");

  return (
    <div className="min-h-screen px-4 py-6 text-white bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 sm:px-6 lg:px-10">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-3xl font-extrabold tracking-tight text-center sm:text-4xl lg:text-5xl"
      >
        Football Player Analytics
      </motion.h1>

      {/* Team Names */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center mb-10 space-y-3 text-xl font-bold sm:flex-row sm:space-y-0 sm:gap-6 md:text-2xl"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-blue-300">{summary.home.team_name}</span>
        </div>
        <span className="text-gray-400">vs</span>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-red-300">{summary.away.team_name}</span>
        </div>
      </motion.div>

      {/* Summary Grids */}
      <div className="grid grid-cols-1 gap-8 mb-12 lg:grid-cols-2">
        {/* Home Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 border shadow-lg sm:p-6 bg-blue-950/40 border-blue-800/50 rounded-2xl backdrop-blur-sm"
        >
          <h2 className="flex items-center gap-2 mb-4 text-lg font-semibold text-blue-300 sm:text-xl">
            <Trophy className="w-5 h-5 text-yellow-400" /> Home Team Stats
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              title="Goals"
              value={summary.home.total_goals}
              accent="from-blue-500/30 to-blue-700/20"
              icon={<Trophy className="w-6 h-6 text-yellow-400" />}
            />
            <SummaryCard
              title="Passes"
              value={summary.home.total_passes}
              accent="from-blue-400/20 to-blue-700/20"
              icon={<ArrowUpRight className="w-6 h-6 text-blue-300" />}
            />
            <SummaryCard
              title="Tackles"
              value={summary.home.total_tackles}
              accent="from-blue-500/30 to-green-700/20"
              icon={<Activity className="w-6 h-6 text-green-300" />}
            />
          </div>
        </motion.div>

        {/* Away Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 border shadow-lg sm:p-6 bg-red-950/40 border-red-800/50 rounded-2xl backdrop-blur-sm"
        >
          <h2 className="flex items-center gap-2 mb-4 text-lg font-semibold text-red-300 sm:text-xl">
            <Trophy className="w-5 h-5 text-yellow-400" /> Opposition Stats
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              title="Goals"
              value={summary.away.total_goals}
              accent="from-red-500/30 to-red-700/20"
              icon={<Trophy className="w-6 h-6 text-yellow-400" />}
            />
            <SummaryCard
              title="Passes"
              value={summary.away.total_passes}
              accent="from-red-400/20 to-red-700/20"
              icon={<ArrowUpRight className="w-6 h-6 text-red-300" />}
            />
            <SummaryCard
              title="Tackles"
              value={summary.away.total_tackles}
              accent="from-red-500/30 to-green-700/20"
              icon={<Activity className="w-6 h-6 text-green-300" />}
            />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <TeamTable players={homePlayers} color="blue" title="Home Players" />
        <TeamTable players={awayPlayers} color="red" title="Opposition Players" />
      </div>

    </div>
  );
};

export default FootballAnalyticsDashboard;
