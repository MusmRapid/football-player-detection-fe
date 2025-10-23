import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
// import Loader from "./components/Loader";
// import SummaryCard from "./components/SummaryCard";
import type { AnalyticsData, EventItem } from "./types/analytics";
import EventsTable from "./components/Tables/EventsTable";
import UploadSection from "./components/HomeComp/UploadSection";
import SummaryAndCounts from "./components/HomeComp/SummaryAndCounts";

const MOCK_FETCH_PATH = "/analytics.json"; // the file you placed in public/

const App: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [events, setEvents] = useState<EventItem[]>([]);

  const handleFileUpload = useCallback((file: File) => {
    // reset states
    setUploading(true);
    setProgress(3);
    setData(null);
    setEvents([]);

    // simulate upload progress
    let p = 3;
    const iv = setInterval(() => {
      p += Math.random() * 12; // random increment
      if (p >= 92) {
        clearInterval(iv);
        // simulate finalizing and fetching analytics.json
        fetch(MOCK_FETCH_PATH)
          .then((r) => r.json())
          .then((json: AnalyticsData) => {
            // small finishing animation
            let finish = 92;
            const fin = setInterval(() => {
              finish += 4;
              setProgress(Math.min(finish, 100));
              if (finish >= 100) {
                clearInterval(fin);
                setTimeout(() => {
                  setData(json);
                  setEvents(json.per_event ?? []);
                  setUploading(false);
                  setProgress(0);
                }, 350);
              }
            }, 60);
          })
          .catch((err) => {
            console.error("Failed to load analytics mock:", err);
            setUploading(false);
            setProgress(0);
          });
      } else {
        setProgress(Math.min(p, 92));
      }
    }, 300);

    // In a real scenario you'd POST the file:
    // const fd = new FormData();
    // fd.append("file", file);
    // fetch("/api/upload", { method: "POST", body: fd, ... })
    // and track progress via XHR upload.onprogress or backend-sent events
  }, []);

  // Re-upload handler just triggers the file pick via UploadSection UI
  const handlePickAgain = () => {
    // we'll pass this down to UploadSection which shows a button when compact
    // no-op here because UploadSection triggers file input itself
  };

  // Render loader if initial fetch needed (not necessary here)
  // if you want automatic fetch on mount, you could implement it.
  // but we start empty and wait for upload.
  return (
    <div className="min-h-screen px-4 py-6 text-white bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 sm:px-6 lg:px-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-3xl font-extrabold tracking-tight text-center sm:text-4xl lg:text-5xl"
      >
        Football Player Analytics
      </motion.h1>

      {/* Upload area at top (compact when data exists) */}
      <div className="mb-8">
        <UploadSection
          compact={!!data}
          uploading={uploading}
          progress={progress}
          onFile={handleFileUpload}
          onPickAgain={handlePickAgain}
        />
      </div>

      {/* If uploading and no data yet, show loader-ish UI under upload area */}
      {uploading && !data && (
        <div className="max-w-4xl mx-auto mt-8">
          <div className="p-6 text-center border border-gray-800 rounded-2xl bg-gray-900/60">
            <p className="text-sm text-gray-300">
              Uploading — processing will begin when upload finishes.
            </p>
          </div>
        </div>
      )}

      {/* When we have data, show summary + events */}
      {data && (
        <main className="max-w-6xl mx-auto space-y-8">
          {/* Summary cards: derive totals from per_event for robustness */}
          <SummaryAndCounts events={events} summaryPayload={data.summary} />

          {/* Events table */}
          <div>
            <h2 className="mb-3 text-lg font-semibold">Detected Events</h2>
            <EventsTable events={events} />
          </div>
        </main>
      )}
    </div>
  );
};

export default App;

