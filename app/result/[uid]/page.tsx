"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import type { Clause } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertTriangle, Search, Film } from 'lucide-react';
import { getResult, getClauseDetail, insertGhostClause, startVideoGen, getVideoGenStatus } from "@/lib/api";
import AnalysisDashboard from "@/components/analysis/AnalysisDashboard";
import ClauseDetailModal from "@/components/analysis/ClauseDetailModal";
import MissingClausesModal from "@/components/analysis/MissingClausesModal";
import LegalAssistant from "@/components/shared/ChatAssistant";
import Timeline from "@/components/shared/Timeline";
import VideoModal from "@/components/analysis/VideoModal";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

// --- MAIN RESULT PAGE COMPONENT ---
export default function ResultPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);
  const [modalClause, setModalClause] = useState<Clause | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [ghostLoading, setGhostLoading] = useState(false);
  const [showMissingClauses, setShowMissingClauses] = useState(false);
  
  // 📹 NEW STATE VARIABLES FOR VIDEO GENERATION
  const [videoJobId, setVideoJobId] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const uidFromUrl = path.substring(path.lastIndexOf('/') + 1);
    setUid(uidFromUrl || "demo-document-123");
  }, []);

  const { data, error, isLoading } = useSWR(uid ? ["result", uid] : null, () => getResult(uid!), { revalidateOnFocus: false });

  // ⏳ USE-SWR FOR POLLING VIDEO STATUS
  const { data: videoStatus } = useSWR(
    videoJobId ? ["videogen-status", videoJobId] : null, 
    () => getVideoGenStatus(videoJobId!),
    { 
      revalidateOnFocus: false, 
      refreshInterval: 5000 // Poll every 5 seconds
    }
  );

  useEffect(() => {
    if (data) {
        const mapped: Clause[] = Array.isArray(data)
          ? data.map((c: any) => ({
              id: c.id || `clause-${Math.random()}`,
              documentId: uid!,
              text: c.original_clause || c.text || c.clause_name || '',
              risk: c.rating || c.risk || 'unknown',
              explanation: c.detailed_rationale || c.explanation || c.description || '',
              alternatives: c.rewrite_options || c.alternatives || [],
              legalAids: c.legal_aids || c.legalAids || [],
            }))
          : [];
        setClauses(mapped);
    }
  }, [data, uid]);

  useEffect(() => {
    if (selectedClauseId && uid) {
      setModalLoading(true);
      setModalClause(null);
      getClauseDetail(uid, selectedClauseId)
        .then((rawData) => {
          const transformedClause = {
            id: rawData.clause_id || selectedClauseId,
            documentId: uid,
            text: rawData.original_text || '',
            risk: rawData.risk || 'unknown',
            explanation: rawData.eli5 || '',
            alternatives: rawData.rewrite_options || [],
            legalAids: rawData.legal_aids || [],
          };
          setModalClause(transformedClause);
        })
        .finally(() => setModalLoading(false));
    } else {
      setModalClause(null);
    }
  }, [selectedClauseId, uid]);
  
  useEffect(() => {
    if (videoStatus && videoStatus.status === 'completed') {
      setVideoUrl(videoStatus.video_url);
      setShowVideoModal(true);
    }
    // Handle other statuses like 'failed'
  }, [videoStatus]);

  const handleGhostAdd = async (clauseType: string) => {
    if (!uid) return;
    setGhostLoading(true);
    try {
      const res = await insertGhostClause(uid);
      const newGhosts: Clause[] = (res.missing_clauses || []).map((c: any) => ({
        id: `ghost-${Date.now()}`,
        documentId: uid,
        text: c.clause_name + ': ' + c.description,
        risk: 'ghost',
        explanation: c.reason,
        alternatives: [],
        legalAids: [],
      }));
      setClauses(prev => [...prev, ...newGhosts]);
    } catch (e) {
      console.error("Failed to add ghost clause", e);
    } finally {
      setGhostLoading(false);
    }
  };

  const handleFindMissingClauses = async () => {
    if (!uid) return;
    setShowMissingClauses(true);
  };
  
  // 🎬 NEW FUNCTION FOR VIDEO GENERATION
  const handleVideoGen = async () => {
    if (!uid) return;
    
    // 📝 This is where the prompt is generated
    const prompt = `Create a short, engaging video summary of the legal document with ID: ${uid}. Highlight key clauses and risks in a simplified, easy-to-understand format.`;

    try {
      const res = await startVideoGen(prompt, uid);
      setVideoJobId(res.job_id);
      setShowVideoModal(true);
    } catch (e) {
      console.error("Failed to start video generation", e);
    }
  };


  // Loading State
  if (isLoading || !uid) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-500" />
        <h2 className="text-2xl font-bold">Analyzing Your Document</h2>
        <p className="text-slate-400">Please wait while our AI performs a detailed analysis...</p>
      </div>
    </div>
  );

  // Error State
  if (error) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
      <div className="text-center space-y-4 p-8 bg-slate-800/50 border border-red-500/30 rounded-2xl">
        <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
        <h2 className="text-2xl font-bold">Analysis Failed</h2>
        <p className="text-slate-400">We couldn't load the analysis. Please try again later.</p>
      </div>
    </div>
  );

  return (
  <>
    <Header />
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="sticky top-0 z-40 bg-slate-900/70 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <a href="/" className="relative inline-flex items-center gap-3 px-6 py-3 font-semibold text-white transition-all duration-300 bg-slate-800/60 border border-slate-700 rounded-xl backdrop-blur-lg shadow-lg hover:bg-slate-800/80 hover:border-indigo-500/60 hover:shadow-indigo-500/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 glassmorphism">Home</a>
          <div>
            <h1 className="text-xl font-bold text-white">Analysis Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1 truncate max-w-xs md:max-w-md">Document: <span className="font-mono text-slate-300">{uid}</span></p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleFindMissingClauses}
              className="relative inline-flex items-center gap-3 px-6 py-3 overflow-hidden font-semibold text-white transition-all duration-300 bg-slate-800/50 border border-slate-700 rounded-xl backdrop-blur-lg group"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)", borderColor: "rgba(99, 102, 241, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_400px_at_50%_100%,rgba(99,102,241,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Search className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Find Missing Clauses</span>
            </motion.button>
            
            {/* 🎥 NEW BUTTON FOR VIDEO GENERATION */}
            <motion.button
              onClick={handleVideoGen}
              className="relative inline-flex items-center gap-3 px-6 py-3 overflow-hidden font-semibold text-white transition-all duration-300 bg-indigo-600/50 border border-indigo-500/70 rounded-xl backdrop-blur-lg group"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)", borderColor: "rgba(99, 102, 241, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_400px_at_50%_100%,rgba(99,102,241,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Film className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Generate Video Summary</span>
            </motion.button>

            <Timeline uid={uid} />
            
            {/* <ExportButton uid={uid} /> */}
          </div>
        </div>
      </header>
      
      <main className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-slate-800/30 to-transparent -z-10"></div>
        
        <AnalysisDashboard
          clauses={clauses}
          onClauseClick={setSelectedClauseId}
          onGhostAdd={handleGhostAdd}
        />
      </main>

      <AnimatePresence>
        {selectedClauseId && (
          <ClauseDetailModal
            clause={modalClause}
            isLoading={modalLoading}
            onClose={() => setSelectedClauseId(null)}
          />
        )}
        
        {/* 🎬 NEW MODAL FOR VIDEO GENERATION */}
        {showVideoModal && (
          <VideoModal
            jobId={videoJobId}
            videoStatus={videoStatus}
            videoUrl={videoUrl}
            onClose={() => {
              setShowVideoModal(false);
              setVideoJobId(null);
              setVideoUrl(null);
            }}
          />
        )}
      </AnimatePresence>

      <MissingClausesModal
        uid={uid}
        isOpen={showMissingClauses}
        onClose={() => setShowMissingClauses(false)}
      />
      
      <LegalAssistant uid={uid} />
    </div>
    <Footer />
    </>
  );
}
