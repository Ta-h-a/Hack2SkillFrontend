"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, AlertOctagon, Ghost, FileText } from "lucide-react";
import type { Clause } from "@/lib/types";

// --- Component Props ---
interface ClauseCardProps {
  clause: Clause;
  isSelected: boolean;
  onClick: (clauseId: string) => void;
}

// --- Risk Configuration ---
// Centralizes styles for a consistent and easily manageable design system.
const riskConfig = {
  green: {
    ring: "hover:ring-green-500/50",
    pillBg: "bg-green-500/10",
    pillText: "text-green-400",
    icon: <CheckCircle2 size={16} />,
    label: "Low Risk",
  },
  yellow: {
    ring: "hover:ring-yellow-500/50",
    pillBg: "bg-yellow-500/10",
    pillText: "text-yellow-400",
    icon: <AlertTriangle size={16} />,
    label: "Medium Risk",
  },
  red: {
    ring: "hover:ring-red-500/50",
    pillBg: "bg-red-500/10",
    pillText: "text-red-400",
    icon: <AlertOctagon size={16} />,
    label: "High Risk",
  },
  ghost: {
    ring: "hover:ring-purple-500/50",
    pillBg: "bg-purple-500/10",
    pillText: "text-purple-400",
    icon: <Ghost size={16} />,
    label: "Missing Clause",
  },
  unknown: {
    ring: "hover:ring-slate-500/50",
    pillBg: "bg-slate-700/50",
    pillText: "text-slate-400",
    icon: <FileText size={16} />,
    label: "General",
  },
};


// --- The Enhanced ClauseCard Component ---

export default React.memo(function ClauseCard({ clause, isSelected, onClick }: ClauseCardProps) {
  const config = riskConfig[clause.risk as keyof typeof riskConfig] || riskConfig.unknown;

  return (
    <motion.div
      onClick={() => onClick(clause.id)}
      className={`relative w-full cursor-pointer rounded-2xl border transition-all duration-300
        ${isSelected 
            ? 'bg-slate-700/60 border-blue-500 shadow-lg shadow-blue-500/10' 
            : `bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 hover:border-slate-700`
        }
      `}
      whileHover={{ y: -4 }}
      layout
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(clause.id)}
      aria-pressed={isSelected}
    >
      {/* Subtle colored ring on hover */}
      <div className={`absolute -inset-px rounded-2xl ring-1 ring-transparent transition-all duration-300 ${!isSelected && config.ring}`}></div>
      
      <div className="relative p-5">
        <div className="flex flex-col h-full">
            {/* Clause Text */}
            <p className="flex-grow text-slate-200 text-base leading-relaxed line-clamp-3 mb-4">
              {clause.text}
            </p>
            
            {/* Risk Label Pill */}
            <div className="flex justify-start">
                 <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full ${config.pillBg} ${config.pillText}`}>
                    {config.icon}
                    <span>{config.label}</span>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
});

