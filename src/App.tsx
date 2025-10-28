import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { AnalyticsData, EventItem } from "./types/analytics";
import EventsTable from "./components/Tables/EventsTable";
import UploadSection from "./components/HomeComp/UploadSection";
import SummaryAndCounts from "./components/HomeComp/SummaryAndCounts";
import Loader from "./components/Loader";

const App: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState<string | null>(null);

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
        jerseyToTeam.set(jersey.trim(), team.toLowerCase());
      }
    });
  }

  // --- Normalize Events ---
  const processedEvents = events.map((ev) => {
    const jersey = ev.player_jersey_number ?? ev.player_name ?? null;
    let team: string | null = null;

    // Priority: ev.team > jerseyToTeam > infer from notes
    if (ev.team) {
      team = ev.team.toLowerCase();
    } else if (jersey && jerseyToTeam.has(jersey)) {
      team = jerseyToTeam.get(jersey)!;
    } else {
      team = inferTeamFromNotes(ev.notes);
    }

    return { ...ev, team };
  });

  // --- Group events by type for each team ---
  const groupByType = (team: string) => {
    const filtered = processedEvents.filter((e) => e.team === team);
    return {
      goals: filtered.filter((e) => e.event_type === "goal"),
      passes: filtered.filter((e) => e.event_type === "pass"),
      tackles: filtered.filter((e) => e.event_type === "tackle"),
    };
  };

  const redTeam = groupByType("red");
  const blueTeam = groupByType("blue");
  const undetermined = {
    goals: processedEvents.filter((e) => !e.team && e.event_type === "goal"),
    passes: processedEvents.filter((e) => !e.team && e.event_type === "pass"),
    tackles: processedEvents.filter((e) => !e.team && e.event_type === "tackle"),
  };

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

      {/* Uploading and processing indicators */}
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

      {/* Error */}
      {error && (
        <div className="max-w-4xl mx-auto mt-6">
          <div className="p-4 text-center text-red-400 border border-red-500/40 rounded-xl bg-red-900/10">
            {error}
          </div>
        </div>
      )}

      {/* Results */}
      <main className="mx-auto space-y-8 max-w-7xl">
        {data?.summary && (
          <SummaryAndCounts events={events} summaryPayload={data.summary} />
        )}

        {data && (
          <>
            {/* Red vs Blue side-by-side */}
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {/* RED TEAM */}
              <section>
                <h2 className="mb-4 text-2xl font-semibold text-red-400">
                  Red Team
                </h2>
                {["goals", "passes", "tackles"].map((type) => (
                  <div
                    key={type}
                    className="p-4 mb-6 border border-gray-800 rounded-xl bg-gray-900/40"
                  >
                    <h3 className="mb-3 text-lg font-medium text-gray-300 capitalize">
                      {type}
                    </h3>
                    <EventsTable events={redTeam[type as keyof typeof redTeam]} />
                  </div>
                ))}
              </section>

              {/* BLUE TEAM */}
              <section>
                <h2 className="mb-4 text-2xl font-semibold text-blue-400">
                  Blue Team
                </h2>
                {["goals", "passes", "tackles"].map((type) => (
                  <div
                    key={type}
                    className="p-4 mb-6 border border-gray-800 rounded-xl bg-gray-900/40"
                  >
                    <h3 className="mb-3 text-lg font-medium text-gray-300 capitalize">
                      {type}
                    </h3>
                    <EventsTable
                      events={blueTeam[type as keyof typeof blueTeam]}
                    />
                  </div>
                ))}
              </section>
            </div>

            {/* UNDERTMINED TEAM — vertical stacking */}
            {Object.values(undetermined).some((arr) => arr.length > 0) && (
              <section className="mt-12">
                <h2 className="mb-4 text-2xl font-semibold text-yellow-400">
                  🟡 Undetermined Team
                </h2>

                <div className="flex flex-col gap-8">
                  {["goals", "passes", "tackles"].map((type) => (
                    <div
                      key={type}
                      className="p-4 border border-gray-800 rounded-xl bg-gray-900/40"
                    >
                      <h3 className="mb-3 text-lg font-medium text-gray-300 capitalize">
                        {type}
                      </h3>
                      <EventsTable
                        events={undetermined[type as keyof typeof undetermined]}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
