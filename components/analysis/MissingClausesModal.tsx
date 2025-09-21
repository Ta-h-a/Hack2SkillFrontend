"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, AlertTriangle, Plus, Loader2, X } from "lucide-react";
import { insertGhostClause } from "@/lib/api";

// --- Meteors Component (Themed and Integrated) ---
const Meteors = ({ number = 20 }: { number?: number }) => {
  const meteors = new Array(number).fill(true);
  return (
    <>
      {meteors.map((el, idx) => (
        <span
          key={"meteor" + idx}
          className="animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-purple-400 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]
            before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#a855f7] before:to-transparent" // purple-500
          style={{
            top: 0,
            left: Math.floor(Math.random() * 800 - 400) + "px",
            animationDelay: Math.random() * 1 + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
          }}
        ></span>
      ))}
    </>
  );
};

// --- Component Props & Types ---
interface MissingClause {
  clause_name: string;
  description: string;
  reason: string;
}

interface MissingClausesModalProps {
  uid: string;
  isOpen: boolean;
  onClose: () => void;
}

// --- Main Modal Component ---
export default function MissingClausesModal({ uid, isOpen, onClose }: MissingClausesModalProps) {
  const [missingClauses, setMissingClauses] = useState<MissingClause[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Reset state when modal is closed
  useEffect(() => {
      if(!isOpen) {
          setTimeout(() => {
            setMissingClauses([]);
            setHasAnalyzed(false);
          }, 300); // Delay reset to allow for exit animation
      }
  }, [isOpen]);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await insertGhostClause(uid);
      await new Promise(res => setTimeout(res, 2000)); // Simulate API call
      // const result = { missing_clauses: [{clause_name: "Dispute Resolution", description: "Defines the process for resolving conflicts.", reason: "Without this, disagreements can lead to costly and lengthy court battles."}, {clause_name: "Confidentiality", description: "Protects sensitive information shared between parties.", reason: "Essential for safeguarding trade secrets and proprietary data."}] };
      setMissingClauses(result.missing_clauses || []);
      setHasAnalyzed(true);
    } catch (error) {
      console.error("Failed to analyze missing clauses:", error);
      setMissingClauses([]);
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setMissingClauses([]);
    setHasAnalyzed(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-4xl bg-slate-900/80 border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col"
            style={{ height: 'clamp(500px, 90vh, 720px)'}}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-5 border-b border-slate-800 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Ghost className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Missing Clause Analysis</h2>
                  <p className="text-sm text-slate-400">Find potential gaps in your document.</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700/50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {!hasAnalyzed ? (
                      <motion.div key="initial" exit={{ opacity: 0, scale: 0.95 }} className="w-full h-full flex items-center justify-center p-8">
                         <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 transform scale-[0.80] rounded-full blur-3xl opacity-30" />
                         <div className="relative shadow-xl bg-gray-900/80 border border-gray-800 px-6 py-10 h-fit overflow-hidden rounded-2xl flex flex-col justify-end items-center text-center max-w-md">
                           <div className="h-12 w-12 rounded-full border-2 flex items-center justify-center mb-6 border-purple-500/50 bg-purple-500/10">
                               <Ghost className="h-6 w-6 text-purple-300"/>
                           </div>
                           <h1 className="font-bold text-2xl text-white mb-3 relative z-10">Uncover Hidden Risks</h1>
                           <p className="font-normal text-base text-slate-400 mb-8 relative z-10">
                            Let our AI scan your document for important clauses that might be missing, helping you strengthen your position.
                           </p>
                           <button onClick={handleAnalyze} disabled={loading} className="border px-6 py-2.5 rounded-xl border-slate-700 bg-slate-800/50 text-slate-200 font-semibold hover:bg-slate-800 hover:border-slate-600 transition-all disabled:opacity-50 flex items-center gap-2">
                              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : "Start Analysis" }
                           </button>
                           <Meteors number={25} />
                         </div>
                      </motion.div>
                    ) : (
                       <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                         <div className="p-6 relative overflow-hidden h-full flex flex-col">
                            <Meteors number={30} />
                             <div className="flex-shrink-0 flex items-center justify-between mb-4">
                               <h3 className="text-lg font-bold text-white">Analysis Complete: {missingClauses.length} Suggestion(s) Found</h3>
                               <button onClick={resetAnalysis} className="text-sm text-purple-400 hover:text-purple-300 font-medium">Run Again</button>
                             </div>
                             <div className="flex-grow space-y-4 overflow-y-auto custom-scrollbar pr-2">
                               {missingClauses.map((clause, index) => (
                                 <motion.div
                                   key={index}
                                   initial={{ opacity: 0, y: 10 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: index * 0.1 }}
                                   className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl hover:border-purple-500/50 transition-colors"
                                 >
                                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-purple-400" />{clause.clause_name}</h4>
                                    <p className="text-sm text-slate-300 pl-7">{clause.description}</p>
                                    <div className="mt-3 p-3 bg-slate-700/50 rounded-lg border-l-4 border-purple-500/80 ml-7">
                                      <p className="text-sm text-slate-400"><span className="font-semibold text-purple-300">Why it matters: </span>{clause.reason}</p>
                                    </div>
                                 </motion.div>
                               ))}
                             </div>
                         </div>
                       </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Add animation keyframes and custom scrollbar styles to a separate style tag in your app's main layout
// For this environment, we inject it dynamically.
if (typeof window !== 'undefined' && !document.getElementById('meteor-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'meteor-styles';
    styleSheet.innerText = `
      @keyframes meteor {
        0% { transform: rotate(215deg) translateX(0); opacity: 1; }
        70% { opacity: 1; }
        100% { transform: rotate(215deg) translateX(-800px); opacity: 0; }
      }
      .animate-meteor-effect { animation: meteor 5s linear infinite; }
      .custom-scrollbar::-webkit-scrollbar { width: 5px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; border-radius: 10px; }
    `;
    document.head.appendChild(styleSheet);
}

