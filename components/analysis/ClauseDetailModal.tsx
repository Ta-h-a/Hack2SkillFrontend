"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, AlertOctagon, Bot, BrainCircuit, Loader2, FileText } from "lucide-react";
import type { Clause } from "@/lib/types";
import { negotiateClause, getClauseDetail } from "@/lib/api";

// --- Risk Configuration ---
const riskConfig = {
  green: {
    statusText: "Low Risk Detected",
    glowClass: "bg-green-500/80 shadow-[0_40px_80px_-16px_rgba(34,197,94,0.7)]",
    glowText: "Clause Appears Safe",
    Icon: CheckCircle2,
    iconColor: "text-green-400",
  },
  yellow: {
    statusText: "Medium Risk Detected",
    glowClass: "bg-yellow-500/80 shadow-[0_40px_80px_-16px_rgba(234,179,8,0.7)]",
    glowText: "Proceed with Caution",
    Icon: AlertTriangle,
    iconColor: "text-yellow-400",
  },
  red: {
    statusText: "High Risk Detected",
    glowClass: "bg-red-500/80 shadow-[0_40px_80px_-16px_rgba(239,68,68,0.7)]",
    glowText: "Action Strongly Recommended",
    Icon: AlertOctagon,
    iconColor: "text-red-400",
  },
  default: {
    statusText: "Clause Information",
    glowClass: "bg-slate-600/80 shadow-[0_40px_80px_-16px_rgba(100,116,139,0.7)]",
    glowText: "General Information",
    Icon: FileText,
    iconColor: "text-slate-400",
  }
};

// --- Component Props ---
interface ClauseDetailModalProps {
  clause: Clause | null;
  isLoading: boolean;
  onClose: () => void;
}

// --- Main Modal Component ---
export default function ClauseDetailModal({ clause, isLoading, onClose }: ClauseDetailModalProps) {
  const [negotiation, setNegotiation] = useState<{ rewritten_clause: string; risk_after: string; ai_explanation: string } | null>(null);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clause) return;
    setNegotiation(null);
    setError(null);

    const fetchClauseDetail = async () => {
      try {
        const cleanId = String(clause.id).replace(".txt", "");
        const data = await getClauseDetail(clause.documentId, cleanId);
        // Update the clause object with the fetched data
        clause.explanation = data.explanation || "No simplified explanation available.";
        clause.alternatives = data.alternatives || [];
      } catch (err) {
        console.error("Failed to fetch clause details", err);
        setError("Could not load detailed clause explanation.");
      }
    };

    fetchClauseDetail();
  }, [clause]);

  const handleNegotiate = async (tone: "friendly" | "firm" | "aggressive") => {
    if (!clause) return;
    setIsNegotiating(true);
    setError(null);
    try {
      const res = await negotiateClause(clause.documentId, clause.id, tone, clause.text, clause.risk);
      setNegotiation(res);
    } catch (e) {
      setError("Negotiation failed. Please try again.");
    } finally {
      setIsNegotiating(false);
    }
  };

  const currentRisk = clause?.risk || "default";
  const config = riskConfig[currentRisk as keyof typeof riskConfig] || riskConfig.default;
  const { Icon } = config;

  return (
    <>
      <AnimatePresence>
        {clause && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow Effect */}
              <div className={`pointer-events-none absolute inset-x-0 -bottom-12 top-[65%] rounded-[36px] blur-2xl transition-colors duration-300 ${config.glowClass}`} />
              
              {/* Glow Text */}
              <div className="absolute inset-x-0 -bottom-8 mx-auto w-full z-20">
                <div className="flex items-center justify-center gap-2 bg-transparent py-3 text-center text-sm font-medium text-white/90">
                  <BrainCircuit className="h-4 w-4" /> {config.glowText}
                </div>
              </div>

              {/* Main Card */}
              <div className="relative z-10 w-full rounded-[28px] border border-slate-800 bg-[radial-gradient(120%_120%_at_30%_10%,#1e293b_0%,#0f172a_60%,#020617_100%)] text-white shadow-2xl">
                  <div className="p-6 sm:p-8">
                      {/* Header */}
                      <div className="flex items-center justify-between text-sm text-slate-300 mb-6">
                          <div className="flex items-center gap-2.5">
                              <span className={`inline-block h-2.5 w-2.5 rounded-full animate-pulse ${config.glowClass.split(' ')[0]}`} />
                              <span className="select-none font-medium">{config.statusText}</span>
                          </div>
                          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                              <X className="h-5 w-5" />
                          </button>
                      </div>

                      {isLoading ? (
                          <div className="flex flex-col items-center justify-center h-80">
                              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                              <p className="mt-4 text-slate-400">Loading clause details...</p>
                          </div>
                      ) : (
                          <div className="max-h-[60vh] overflow-y-auto pr-4 -mr-4 space-y-6 custom-scrollbar">
                              {/* Clause Details */}
                              <DetailSection title="Original Clause" icon={<Icon className={`w-5 h-5 ${config.iconColor}`} />}>
                                  <p className="text-slate-300 leading-relaxed">{clause.text}</p>
                              </DetailSection>

                              <DetailSection title="AI Explanation (ELI5)">
                                  <p className="text-slate-300 leading-relaxed">{clause.explanation}</p>
                              </DetailSection>

                              {/* Negotiation Section */}
                              <DetailSection title="Negotiation AI">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                      <NegotiateButton tone="friendly" onNegotiate={handleNegotiate} disabled={isNegotiating} />
                                      <NegotiateButton tone="firm" onNegotiate={handleNegotiate} disabled={isNegotiating} />
                                      <NegotiateButton tone="aggressive" onNegotiate={handleNegotiate} disabled={isNegotiating} />
                                  </div>
                                  
                                  <AnimatePresence>
                                  {isNegotiating && (
                                      <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} className="flex items-center gap-2 text-sm text-slate-400 mt-4">
                                          <Loader2 className="w-4 h-4 animate-spin"/> AI is crafting a response...
                                      </motion.div>
                                  )}
                                  </AnimatePresence>

                                  {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
                                  
                                  <AnimatePresence>
                                  {negotiation && (
                                      <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                          <div className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                                              <Bot className="w-5 h-5"/> AI Suggestion:
                                          </div>
                                          <p className="text-slate-200">{negotiation.rewritten_clause}</p>
                                      </motion.div>
                                  )}
                                  </AnimatePresence>
                              </DetailSection>
                          </div>
                      )}
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #475569; /* slate-600 */
          border-radius: 10px;
          border: 3px solid transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #64748b; /* slate-500 */
        }
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #475569 transparent;
        }
      `}</style>
    </>
  );
}

// --- Helper Components for Modal ---

const DetailSection = ({ title, icon, children }: {title: string, icon?: React.ReactNode, children: React.ReactNode}) => (
    <div>
        <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
            {icon} {title}
        </h3>
        {children}
    </div>
);

const toneConfig = {
    friendly: { label: "Friendly", className: "bg-white/5 hover:bg-white/10" },
    firm: { label: "Firm", className: "bg-white/5 hover:bg-white/10" },
    aggressive: { label: "Aggressive", className: "bg-white/5 hover:bg-white/10" },
}
const NegotiateButton = ({ tone, onNegotiate, disabled }: {tone: "friendly" | "firm" | "aggressive", onNegotiate: (t: any) => void, disabled: boolean}) => {
    const config = toneConfig[tone];
    return (
        <button onClick={() => onNegotiate(tone)} disabled={disabled} className={`w-full h-11 flex items-center justify-center gap-3 rounded-xl text-white transition-colors text-sm font-medium ${config.className} disabled:opacity-50 disabled:cursor-not-allowed`}>
            {config.label} Counter
        </button>
    )
}

