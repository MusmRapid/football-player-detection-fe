import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import type { AnalyticsData, EventItem } from "./types/analytics";
import EventsTable from "./components/Tables/EventsTable";
import UploadSection from "./components/HomeComp/UploadSection";
import SummaryAndCounts from "./components/HomeComp/SummaryAndCounts";
import Loader from "./components/Loader";
import { ChevronDown } from "lucide-react";

const App: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // --- Simulated upload ---
  const handleFileUpload = useCallback(async () => {
    setUploading(true);
    setProcessing(false);
    setProgress(0);
    setData(null);
    setEvents([]);
    setError(null);

    try {
      let progressVal = 0;
      const progressInterval = setInterval(() => {
        progressVal += 8;
        setProgress(Math.min(progressVal, 95));
      }, 200);

      setTimeout(async () => {
        clearInterval(progressInterval);
        setUploading(false);
        setProcessing(true);

        const response = await fetch("/analytics.json");
        const json: AnalyticsData = await response.json();

        setTimeout(() => {
          setData(json);
          setEvents(json.per_event ?? []);
          setProcessing(false);
          setProgress(0);
        }, 800);
      }, 1500);
    } catch (err) {
      console.error("Failed to load analytics.json:", err);
      setError("Failed to load analytics.json file.");
      setUploading(false);
      setProcessing(false);
      setProgress(0);
    }
  }, []);

  // --- Helpers ---
  const inferTeamFromNotes = (note?: string): string | null => {
    if (!note) return null;
    const text = note.toLowerCase();
    if (text.includes("red") || text.includes("maroon")) return "red";
    if (text.includes("blue") || text.includes("light blue")) return "blue";
    return null;
  };

  // Map jersey numbers → team
  const jerseyToTeam = new Map<string, string>();
  if (data?.summary?.players) {
    data.summary.players.forEach((p) => {
      const jersey =
        p.player_jersey_number || p.jersey_number || p.player_name || null;
      const team = p.team || inferTeamFromNotes(p.notes || "");
      if (jersey && team) {
        const normalized = team.toLowerCase() === "maroon" ? "red" : team.toLowerCase();
        jerseyToTeam.set(jersey.trim(), normalized);
      }
    });
  }

  // --- Normalize Events ---
  const processedEvents = useMemo(() => {
    return events.map((ev) => {
      const jersey = ev.player_jersey_number ?? ev.player_name ?? null;
      let team: string | null = null;

      if (ev.team) {
        team = ev.team.toLowerCase() === "maroon" ? "red" : ev.team.toLowerCase();
      } else if (jersey && jerseyToTeam.has(jersey)) {
        team = jerseyToTeam.get(jersey)!;
      } else {
        team = inferTeamFromNotes(ev.notes);
      }

      return { ...ev, team };
    });
  }, [events]);

  // --- Filter by team ---
  const redTeam = processedEvents.filter((e) => e.team === "red");
  const blueTeam = processedEvents.filter((e) => e.team === "blue");

  // --- Filter by event type ---
  const filterEvents = (teamEvents: EventItem[]) => {
    if (filter === "all") return teamEvents;
    return teamEvents.filter(
      (e) => e.event_type.toLowerCase() === filter.toLowerCase()
    );
  };

  // --- Dropdown options ---
  const eventTypes = ["all", "goal", "miss shot", "pass", "save", "tackle"];

  // --- UI ---
  return (
    <div className="min-h-screen px-4 py-6 text-white bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 sm:px-6 lg:px-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-3xl font-medium tracking-tight text-center sm:text-4xl lg:text-5xl"
      >
        Football Player Analytics
      </motion.h1>

      {/* Upload section */}
      <div className="mb-8">
        <UploadSection
          compact={!!data}
          uploading={uploading}
          progress={progress}
          onFile={handleFileUpload}
        />
      </div>

      {/* Status */}
      {uploading && !data && (
        <div className="max-w-4xl mx-auto mt-8">
          <div className="p-6 text-center border border-gray-800 rounded-2xl bg-gray-900/60">
            <p className="text-sm text-gray-300">
              Uploading video... ({progress}%)
            </p>
          </div>
        </div>
      )}

      {processing && !data && (
        <div className="max-w-4xl mx-auto mt-16">
          <Loader message="AI is processing your video — please wait..." />
        </div>
      )}

      {error && (
        <div className="max-w-4xl mx-auto mt-6">
          <div className="p-4 text-center text-red-400 border border-red-500/40 rounded-xl bg-red-900/10">
            {error}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="mx-auto space-y-8 max-w-7xl">
        {data?.summary && (
          <SummaryAndCounts events={events} summaryPayload={data.summary} />
        )}

        {data && (
          <>
            <div className="flex flex-col items-center justify-end gap-4 mb-8 sm:flex-row">
              <h3 className="text-xl font-semibold text-gray-300">
                Filter Events
              </h3>

              <div className="relative">
                <motion.select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.03 }}
                  style={{
                    backgroundColor: "#1e293b",
                  }}
                  className="px-4 py-2 pr-10 text-sm font-medium text-white border rounded-lg shadow-md appearance-none cursor-pointer bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 border-blue-500/30"
                >
                  {eventTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="text-white bg-gray-900 hover:bg-gray-800"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </motion.select>

                {/* Dropdown icon (Lucide) */}
                <ChevronDown
                  className="absolute w-4 h-4 text-gray-200 -translate-y-1/2 pointer-events-none right-3 top-1/2"
                />
              </div>
            </div>

            {/* Red vs Blue side-by-side */}
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <section>
                <h2 className="mb-4 text-2xl font-semibold text-red-400">
                  Red Team
                </h2>
                <EventsTable events={filterEvents(redTeam)} />
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold text-blue-400">
                  Blue Team
                </h2>
                <EventsTable events={filterEvents(blueTeam)} />
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
