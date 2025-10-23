import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface UploadSectionProps {
  compact?: boolean; // compact layout when data exists
  uploading: boolean;
  progress: number; // 0 - 100
  onFile: (file: File) => void;
  onPickAgain?: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  compact = false,
  uploading,
  progress,
  onFile,
  onPickAgain,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      onFile(e.dataTransfer.files[0]);
    }
  }

  function handlePick() {
    inputRef.current?.click();
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${compact ? "max-w-3xl mx-auto" : "max-w-xl mx-auto"} `}
    >
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={`relative rounded-2xl border-2 ${
          dragOver ? "border-indigo-400/60" : "border-gray-800"
        } bg-gray-900/60 p-6 flex flex-col items-center justify-center text-center shadow-lg`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
          className="hidden"
        />

        {!uploading ? (
          <>
            <h3 className="mb-2 text-lg font-semibold">Upload match video</h3>
            <p className="mb-4 text-sm text-gray-400">
              Drag & drop a video here or click to choose a file. (MP4 preferred)
            </p>

            <div className="flex gap-3">
              <button
                onClick={handlePick}
                className="px-4 py-2 text-indigo-300 transition border rounded-lg bg-indigo-600/30 border-indigo-400/20 hover:scale-105"
              >
                Choose file
              </button>

              {compact && (
                <button
                  onClick={() => onPickAgain?.()}
                  className="px-4 py-2 text-gray-300 transition border border-gray-700 rounded-lg bg-gray-800/60 hover:scale-105"
                >
                  Upload another
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Uploading video</p>
                <p className="text-sm text-gray-300">{Math.round(progress)}%</p>
              </div>

              <div className="w-full h-3 overflow-hidden bg-gray-800 rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                  className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                />
              </div>

              <p className="mt-2 text-xs text-gray-400">
                This is a mocked upload in the demo — the backend will process the
                file and return analytics.
              </p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default UploadSection;
