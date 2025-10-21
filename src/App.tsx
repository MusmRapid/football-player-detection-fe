import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, ArrowUpRight, Activity, Users,  } from "lucide-react";
import Loader from "./components/Loader";
import SummaryCard from "./components/SummaryCard";
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

  return (
    <div className="min-h-screen p-6 text-white bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-4xl font-bold tracking-tight text-center"
      >
        Football  Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-3">
        <SummaryCard
          title="Total Goals"
          value={summary.total_goals}
          accent="from-yellow-400/20 to-yellow-600/10"
          icon={<Trophy className="text-yellow-300 w-7 h-7" />}
        />
        <SummaryCard
          title="Total Passes"
          value={summary.total_passes}
          accent="from-blue-400/20 to-blue-600/10"
          icon={<ArrowUpRight className="text-blue-300 w-7 h-7" />}
        />
        <SummaryCard
          title="Total Tackles"
          value={summary.total_tackles}
          accent="from-green-400/20 to-green-600/10"
          icon={<Activity className="text-green-300 w-7 h-7" />}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border border-gray-800 shadow-2xl bg-gray-900/70 rounded-2xl backdrop-blur-sm"
      >
        <h2 className="flex items-center gap-2 mb-6 text-xl font-semibold">
          <Users className="w-5 h-5 text-indigo-400" /> Player Statistics
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-xs tracking-wider text-gray-400 uppercase border-b border-gray-800">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Player</th>
                <th className="p-3 text-center">Goals</th>
                <th className="p-3 text-center">Passes</th>
                <th className="p-3 text-center">Tackles</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, i) => (
                <motion.tr
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="transition duration-200 border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="p-3 text-gray-400">#{player.id}</td>
                  <td className="p-3 font-medium">{player.name}</td>
                  <td className="p-3 font-semibold text-center text-yellow-300">
                    {player.goals}
                  </td>
                  <td className="p-3 font-semibold text-center text-blue-300">
                    {player.passes}
                  </td>
                  <td className="p-3 font-semibold text-center text-green-300">
                    {player.tackles}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default FootballAnalyticsDashboard;
