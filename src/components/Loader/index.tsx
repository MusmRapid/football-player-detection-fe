import React from "react";
import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";

const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen text-gray-400 space-y-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full"
    />
    <p className="text-lg font-medium tracking-wide flex items-center gap-2">
      <RefreshCcw className="w-5 h-5 animate-spin-slow" /> Loading analytics...
    </p>
  </div>
);

export default Loader