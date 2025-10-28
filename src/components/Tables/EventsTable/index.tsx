import React from "react";
import { motion } from "framer-motion";
import type { EventItem } from "../../../types/analytics";

interface EventsTableProps {
  events: EventItem[];
}

function formatTime(s?: number) {
  if (s == null || Number.isNaN(s)) return "-";
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

const EventsTable: React.FC<EventsTableProps> = ({ events }) => {
  if (!events?.length)
    return (
      <div className="p-6 text-center text-gray-400">
        No events detected yet.
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 overflow-x-auto border border-gray-800 shadow-xl rounded-2xl bg-gray-900/60"
    >
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="text-xs text-gray-400 uppercase border-b border-gray-800 bg-gray-900/80">
            <th className="p-3 text-center">Jersey No.</th>
            <th className="p-3 text-center">Player Name</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-center">Confidence</th>
            <th className="p-3 text-center">Time</th>
            <th className="p-3 text-left">Notes</th>
          </tr>
        </thead>

        <tbody>
          {events.map((ev, i) => (
            <motion.tr
              key={ev.event_id + i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`border-b border-gray-800/70 hover:bg-gray-800/40 ${
                i % 2 === 0 ? "bg-gray-900/40" : "bg-gray-950/30"
              }`}
            >
              <td className="p-3 font-semibold text-center text-blue-300">
                {ev.player_jersey_number ?? "-"}
              </td>
              <td className="p-3 font-semibold text-center text-blue-300">{ev.player_name ?? "-"}</td>
              <td className="p-3 capitalize">{ev.event_type}</td>
              <td className="p-3 font-medium text-center text-yellow-300">
                {(ev.confidence ?? 0).toFixed(2)}
              </td>
              <td className="p-3 text-center text-green-300 whitespace-nowrap">
                {formatTime(ev.start_time)} — {formatTime(ev.end_time)}
              </td>
              <td className="p-3 text-gray-300 break-words whitespace-pre-wrap">
                {ev.notes ?? "-"}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      <p className="mt-3 text-xs text-center text-gray-500 sm:hidden">
        ↔ Scroll horizontally to view all columns
      </p>
    </motion.div>
  );
};

export default EventsTable;
