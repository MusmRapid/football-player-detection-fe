import React from "react";
import { motion } from "framer-motion";
import type { TeamTableProps } from "../../../types/analytics";
import { Users } from "lucide-react";

const TeamTable: React.FC<TeamTableProps> = ({ players, color, title }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-6 rounded-2xl shadow-2xl border ${
      color === "blue"
        ? "bg-blue-950/40 border-blue-800/50"
        : "bg-red-950/40 border-red-800/50"
    }`}
  >
    <h2
      className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
        color === "blue" ? "text-blue-300" : "text-red-300"
      }`}
    >
      <Users className="w-5 h-5" /> {title}
    </h2>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-400 uppercase border-b border-gray-800">
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
              className="transition duration-200 border-b border-gray-800 hover:bg-gray-800/30"
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
);

export default TeamTable;