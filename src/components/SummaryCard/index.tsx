import React from "react";
import { motion } from "framer-motion";
import type { SummaryCardProps } from "../../types/analytics";

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, accent }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gradient-to-br ${accent} rounded-2xl p-5 flex items-center justify-between shadow-xl border border-gray-800 transition`}
  >
    <div>
      <h3 className="text-gray-300 text-sm tracking-wide">{title}</h3>
      <p className="text-3xl font-extrabold mt-1 drop-shadow-md">{value}</p>
    </div>
    <div className="p-3 bg-gray-900/70 rounded-xl shadow-inner">{icon}</div>
  </motion.div>
);

export default SummaryCard