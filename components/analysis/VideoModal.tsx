
import React from "react";
import { motion } from "framer-motion";
import { X, Loader2, PlayCircle, AlertTriangle } from "lucide-react"; 

// Define the types for the props
interface VideoModalProps {
    jobId: string | null;
    videoStatus: {
      status: 'queued' | 'in_progress' | 'completed' | 'failed';
      video_url?: string;
      error?: string;
    } | null;
    videoUrl: string | null;
    onClose: () => void;
  }

export default function VideoModal({ jobId, videoStatus, videoUrl, onClose }) {
  const isGenerating = videoStatus?.status === 'in_progress' || videoStatus?.status === 'queued';
  const isCompleted = videoStatus?.status === 'completed';
  const isFailed = videoStatus?.status === 'failed';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="relative w-full max-w-2xl p-6 bg-slate-800 rounded-3xl border border-slate-700 shadow-xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
          <X size={24} />
        </button>
        <div className="flex flex-col items-center text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Video Generation</h2>
          <p className="text-slate-400">Status: <span className="font-mono">{videoStatus?.status}</span></p>

          {isGenerating && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <Loader2 className="w-16 h-16 animate-spin text-indigo-500" />
              <p className="text-lg text-slate-300">Generating video summary...</p>
              <p className="text-sm text-slate-500">This may take a few minutes. Don't close this page.</p>
            </div>
          )}

          {isCompleted && videoUrl && (
            <div className="w-full">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border-2 border-slate-700">
                <video controls className="w-full h-full object-cover">
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <a href={videoUrl} download className="mt-4 inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition">
                <PlayCircle size={20} />
                Download Video
              </a>
            </div>
          )}

          {isFailed && (
            <div className="flex flex-col items-center space-y-4 text-center text-red-400">
              <AlertTriangle className="w-16 h-16" />
              <p className="text-lg">Video generation failed.</p>
              <p className="text-sm text-red-500">Error: {videoStatus?.error || 'Unknown error'}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}