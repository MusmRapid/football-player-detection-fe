import React from "react";
import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";

const Loader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-400">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-indigo-400 rounded-full border-t-transparent"
    />
    <p className="flex items-center gap-2 text-lg font-medium tracking-wide">
      <RefreshCcw className="w-5 h-5 animate-spin-slow" />{" "}
      {message || "Loading analytics..."}
    </p>
  </div>
);

export default Loader;
