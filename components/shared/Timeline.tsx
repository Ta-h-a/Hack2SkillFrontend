"use client";

import React, { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { getTimeline } from "@/lib/api"; // Assumed API function
import { Clock, UploadCloud, FileCheck, MessageSquare, Ghost, FileDown, Pencil, Info, X, Loader2 } from "lucide-react";

// --- Mock API for Demonstration ---
const mockTimelineEvents = [
    { event_type: 'export', description: 'Document exported as PDF.', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { event_type: 'negotiate', description: 'Negotiation suggestion generated for "Liability Clause".', timestamp: new Date(Date.now() - 7200000).toISOString(), details: 'Tone: Firm' },
    { event_type: 'ghost', description: 'Missing "Dispute Resolution" clause added.', timestamp: new Date(Date.now() - 10800000).toISOString() },
    { event_type: 'analysis', description: 'Initial document analysis completed.', timestamp: new Date(Date.now() - 86400000).toISOString(), details: '3 High-risk clauses found.' },
    { event_type: 'upload', description: 'Document "Service Agreement v2.pdf" uploaded.', timestamp: new Date(Date.now() - 87400000).toISOString() },
];
const mockGetTimeline = async (uid: string) => {
    await new Promise(res => setTimeout(res, 1000));
    return mockTimelineEvents;
};

// --- Event Configuration ---
const eventConfig = {
  upload: { icon: UploadCloud, color: "blue" },
  analysis: { icon: FileCheck, color: "green" },
  negotiate: { icon: MessageSquare, color: "yellow" },
  ghost: { icon: Ghost, color: "purple" },
  export: { icon: FileDown, color: "indigo" },
  edit: { icon: Pencil, color: "orange" },
  default: { icon: Info, color: "slate" },
};

const colorClasses = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    green: { bg: 'bg-green-500/10', text: 'text-green-400' },
    yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
    slate: { bg: 'bg-slate-700/50', text: 'text-slate-400' },
};


// --- Timeline Component ---
interface TimelineProps {
  uid: string;
}

export default function Timeline({ uid }: TimelineProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const { data: timeline, error, isLoading } = useSWR(
    isOpen ? ["timeline", uid] : null,
    () => mockGetTimeline(uid)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 ring-1 ring-inset ring-slate-700/50 transition-all hover:bg-slate-800/80 hover:ring-slate-700"
      >
        <Clock size={16} />
        Timeline
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-96 origin-top-right rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl backdrop-blur-lg z-20"
          >
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
              <h3 className="text-lg font-bold text-white">Document Timeline</h3>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-white">
                <X size={16} />
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto p-4 custom-scrollbar">
              {isLoading && <div className="flex justify-center items-center p-8 text-slate-400 text-sm"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Loading...</div>}
              {error && <div className="text-red-400 text-sm p-4 text-center">Failed to load timeline.</div>}
              {!isLoading && !error && timeline && timeline.length === 0 && <div className="text-slate-500 text-sm p-4 text-center">No events found.</div>}
              
              {!isLoading && !error && timeline && timeline.length > 0 && (
                <div className="relative pl-5">
                   {/* Vertical line - Correctly positioned and styled */}
                   <div className="absolute left-5 top-0 h-full w-px bg-slate-700 z-0"></div>
                   
                   <div className="space-y-7">
                    {timeline.map((event: any, index: number) => {
                      const eventTypeKey = (event.type || event.event_type).split('_')[0];
                      const config = eventConfig[eventTypeKey as keyof typeof eventConfig] || eventConfig.default;
                      const colors = colorClasses[config.color as keyof typeof colorClasses];
                      const Icon = config.icon;

                      return (
                        <div key={index} className="relative flex items-start gap-4">
                          <div className="absolute left-0 top-0 flex h-10 -translate-x-1/2 items-center justify-center">
                              {/* Enhanced Icon UI */}
                              <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${colors.bg} ring-8 ring-slate-900`}>
                                <Icon className={colors.text} size={20} />
                              </div>
                          </div>
                          <div className="flex-1 min-w-0 pl-12 pt-1.5">
                            <p className="text-sm font-medium text-slate-200">
                              {event.description}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {formatDate(event.timestamp)}
                            </p>
                            {event.details && (
                              <div className="mt-2 text-xs text-slate-400 bg-slate-800/50 p-2 rounded-md border border-slate-700/50">
                                {event.details}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #475569; /* slate-600 */
          border-radius: 10px;
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
    </div>
  );
}

