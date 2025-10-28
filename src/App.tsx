import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { AnalyticsData, EventItem } from "./types/analytics";
import EventsTable from "./components/Tables/EventsTable";
import UploadSection from "./components/HomeComp/UploadSection";
import SummaryAndCounts from "./components/HomeComp/SummaryAndCounts";
import Loader from "./components/Loader";

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const App: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Simulated upload (replace later with axios if backend ready)
  const handleFileUpload = useCallback(async () => {
    setUploading(true);
    setProcessing(false);
    setProgress(0);
    setData(null);
    setEvents([]);
    setError(null);

    try {
      // fake upload progress
      let progressVal = 0;
      const progressInterval = setInterval(() => {
        progressVal += 10;
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
      console.error("Failed to load static analytics.json:", err);
      setError("Failed to load analytics.json file.");
      setUploading(false);
      setProcessing(false);
      setProgress(0);
    }
  }, []);

  // Helper: infer team from notes text
  const inferTeamFromNotes = (note?: string): string | null => {
    if (!note) return null;
    const text = note.toLowerCase();
    if (text.includes("red") || text.includes("maroon")) return "red";
    if (text.includes("blue")) return "blue";
    return null;
  };

  // Build a quick lookup of jersey → team from summary
  const jerseyToTeam = new Map<string, string>();
  if (data?.summary?.players) {
    data.summary.players.forEach((p) => {
      const jersey =
        p.player_jersey_number || p.jersey_number || p.player_name || null;
      if (jersey && p.team) {
        jerseyToTeam.set(jersey.trim(), p.team.toLowerCase());
      }
    });
  }

  // Process events using that mapping
  const processedEvents = events.map((ev) => {
    const jersey = ev.player_jersey_number ?? ev.player_name ?? null;
    let team: string | null = null;

    if (jersey && jerseyToTeam.has(jersey)) {
      team = jerseyToTeam.get(jersey)!;
    } else if (ev.team) {
      team = ev.team.toLowerCase();
    } else {
      team = inferTeamFromNotes(ev.notes);
    }

    return { ...ev, team };
  });

  // Categorize
  const redTeamEvents = processedEvents.filter((ev) => ev.team === "red");
  const blueTeamEvents = processedEvents.filter((ev) => ev.team === "blue");
  const undeterminedEvents = processedEvents.filter((ev) => !ev.team);

  return (
    <div className="min-h-screen px-4 py-6 text-white bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 sm:px-6 lg:px-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-3xl font-medium tracking-tight text-center sm:text-4xl lg:text-5xl"
      >
        Football Player Analytics
      </motion.h1>

      {/* Upload Section */}
      <div className="mb-8">
        <UploadSection
          compact={!!data}
          uploading={uploading}
          progress={progress}
          onFile={handleFileUpload}
        />
      </div>

      {/* Uploading state */}
      {uploading && !data && (
        <div className="max-w-4xl mx-auto mt-8">
          <div className="p-6 text-center border border-gray-800 rounded-2xl bg-gray-900/60">
            <p className="text-sm text-gray-300">
              Uploading video... ({progress}%)
            </p>
          </div>
        </div>
      )}

      {/* Processing state */}
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

      {/* Main Content */}
      <main className="mx-auto space-y-8 max-w-7xl">
        {data?.summary && (
          <SummaryAndCounts events={events} summaryPayload={data.summary} />
        )}

        {/* Only show tables once data loaded */}
        {data && (
          <div>
            <h2 className="mb-3 text-lg font-semibold">Detected Events</h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-red-400">Red Team</h3>
                <EventsTable events={redTeamEvents} />
              </div>

              <div>
                <h3 className="mb-2 text-blue-400">Blue Team</h3>
                <EventsTable events={blueTeamEvents} />
              </div>
            </div>

            {undeterminedEvents.length > 0 && (
              <div className="pt-8 border-t border-gray-800">
                <h3 className="mb-2 text-yellow-400">Undetermined Events</h3>
                <EventsTable events={undeterminedEvents} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
