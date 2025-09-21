"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand, Loader2, Bot } from "lucide-react";
import { negotiateClause } from "@/lib/api"; // Assumed API function

// --- Mock API for Demonstration ---
const mockNegotiateClause = async (uid: string, clauseId: string, tone: string) => {
    await new Promise(res => setTimeout(res, 1500));
    return {
        suggestion: `Based on a ${tone} approach, we propose the following revision: "Each party agrees to be responsible for damages arising directly from its own negligence or willful misconduct, with liability capped at the total value of this contract."`,
    };
};

// --- Component Props ---
interface NegotiationHelperProps {
  uid: string;
  clauseId: string;
}

type Tone = "friendly" | "firm" | "aggressive";

// --- Main NegotiationHelper Component ---
export default function NegotiationHelper({ uid, clauseId }: NegotiationHelperProps) {
  const [tone, setTone] = useState<Tone>("friendly");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNegotiate = async () => {
    setLoading(true);
    setSuggestion(null); // Clear previous suggestion
    try {
      // In a real app, you'd use the imported negotiateClause
      const res = await mockNegotiateClause(uid, clauseId, tone);
      setSuggestion(res.suggestion);
    } catch {
      setSuggestion("Sorry, an error occurred while generating a suggestion.");
    } finally {
      setLoading(false);
    }
  };

  const tones: { id: Tone; label: string }[] = [
    { id: "friendly", label: "Friendly" },
    { id: "firm", label: "Firm" },
    { id: "aggressive", label: "Aggressive" },
  ];

  return (
    <div className="mt-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
      <h3 className="text-lg font-bold text-white mb-4">AI Negotiation Helper</h3>
      
      <div className="space-y-5">
        {/* Tone Selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Select a Tone</label>
          <div className="flex w-full bg-slate-700/50 border border-slate-600 rounded-lg p-1">
            {tones.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`w-full text-center text-sm font-medium py-2 rounded-md transition-colors relative ${
                  tone === t.id ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tone === t.id && (
                  <motion.div
                    layoutId="negotiationTone"
                    className="absolute inset-0 bg-blue-600 rounded-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Generate Button */}
        <button
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-3 transition-all duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
          onClick={handleNegotiate}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Wand className="w-5 h-5" />
          )}
          <span>{loading ? "Generating Suggestion..." : "Generate AI Suggestion"}</span>
        </button>

        {/* Suggestion Output */}
        <AnimatePresence>
          {suggestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-slate-700/50 border border-slate-600 rounded-lg"
            >
              <div className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span>AI Suggestion:</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">{suggestion}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
