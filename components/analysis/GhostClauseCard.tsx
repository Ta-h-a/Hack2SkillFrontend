"use client";

import React from "react";
import { motion } from "framer-motion";
import { PlusCircle, Ghost } from "lucide-react";
import type { Clause } from "@/lib/types"; // Assuming this type is defined in your project

// --- Component Props ---
interface GhostClauseCardProps {
  clause: Clause;
  onAdd: (clauseType: string) => void;
  isLoading?: boolean;
}


// --- The Enhanced GhostClauseCard Component ---

export default function GhostClauseCard({ clause, onAdd, isLoading }: GhostClauseCardProps) {
  return (
    <motion.div
      className="relative w-full h-full rounded-2xl p-px"
      style={{
          background: "repeating-linear-gradient(45deg, #475569, #475569 5px, transparent 5px, transparent 10px)" // slate-600 dashed
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="relative z-10 w-full h-full bg-slate-800/90 rounded-[15px] p-6 flex flex-col justify-between backdrop-blur-sm">
        <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-shrink-0 text-purple-400">
                <Ghost size={22} />
              </div>
              <h3 className="font-bold text-lg text-purple-300">Missing Clause Identified</h3>
            </div>

            {/* Content */}
            <p className="font-semibold text-slate-100 mb-2">{clause.text}</p>
            {clause.explanation && (
              <p className="text-sm text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-300">Reason: </span>{clause.explanation}
              </p>
            )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
           <button
            className="w-full flex items-center justify-center gap-2 bg-purple-600/80 text-white font-semibold rounded-xl px-4 py-2.5 transition-all duration-200 hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onAdd(clause.text)}
            disabled={isLoading}
           >
            <PlusCircle size={18} />
            {isLoading ? "Adding..." : "Add Standard Clause"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
