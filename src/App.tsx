import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
// import axios from "axios";
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

  // const handleFileUpload = useCallback(async (file: File) => {
  //   setUploading(true);
  //   setProcessing(false);
  //   setProgress(0);
  //   setData(null);
  //   setEvents([]);
  //   setError(null);

  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const response = await axios.post(`${BACKEND_URL}/process_video`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //       onUploadProgress: (e) => {
  //         if (e.total) {
  //           const percent = Math.round((e.loaded * 100) / e.total);
  //           setProgress(percent);
  //         }
  //       },
  //     });

  //     setUploading(false);
  //     setProcessing(true);

  //     setTimeout(() => {
  //       const json: AnalyticsData = response.data;
  //       setData(json);
  //       setEvents(json.per_event ?? []);
  //       setProcessing(false);
  //       setProgress(0);
  //     }, 800);
  //   } catch (err) {
  //     console.error("Upload failed:", err);
  //     setError("Failed to upload or process the video. Please try again.");
  //     setUploading(false);
  //     setProcessing(false);
  //     setProgress(0);
  //   }
  // }, []);


  const handleFileUpload = useCallback(async () => {
  setUploading(true);
  setProcessing(false);
  setProgress(0);
  setData(null);
  setEvents([]);
  setError(null);

  try {
    // Simulate upload progress
    let progressVal = 0;
    const progressInterval = setInterval(() => {
      progressVal += 8;
      setProgress(Math.min(progressVal, 95));
    }, 200);

    setTimeout(async () => {
      clearInterval(progressInterval);
      setUploading(false);
      setProcessing(true);

      // Load static JSON instead of backend
      const response = await fetch("/analytics.json");
      const json: AnalyticsData = await response.json();

      // Simulate small processing delay
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

const inferTeam = (note?: string): string | null => {
  if (!note) return null;
  const text = note.toLowerCase();
  if (text.includes("red")) return "red";
  if (text.includes("blue")) return "blue";
  if (text.includes("maroon")) return "red"; // maroon considered red
  return null;
};

const processedEvents = events.map((ev) => ({
  ...ev,
  team: ev.team ?? inferTeam(ev.notes),
}));

const redTeamEvents = processedEvents.filter(ev => ev.team === "red");
const blueTeamEvents = processedEvents.filter(ev => ev.team === "blue");
const undeterminedEvents = processedEvents.filter(ev => !ev.team);


  return (
    <div className="min-h-screen px-4 py-6 text-white bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 sm:px-6 lg:px-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-3xl font-medium tracking-tight text-center sm:text-4xl lg:text-5xl"
      >
        Football Player Analytics
      </motion.h1>

      <div className="mb-8">
        <UploadSection
          compact={!!data}
          uploading={uploading}
          progress={progress}
          onFile={handleFileUpload}
        />
      </div>

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

    <main className="mx-auto space-y-8 max-w-7xl">
      {data?.summary && (
        <SummaryAndCounts events={events} summaryPayload={data.summary} />
      )}

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
