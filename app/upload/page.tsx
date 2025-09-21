"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, Loader, FileCheck, ShieldCheck, Eye, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadDocument } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

// --- FileUploadForm Component ---
// This component now handles the full upload and configuration flow.
const FileUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("pdf");
  const [status, setStatus] = useState<'idle' | 'configuring' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const currentFile = acceptedFiles[0];
      setFile(currentFile);
      setDocName(currentFile.name.replace(/\.[^/.]+$/, "")); // Pre-fill name without extension
      setStatus('configuring');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: false,
    disabled: status !== 'idle',
  });
  
  const removeFile = () => {
      setFile(null);
      setDocName("");
      setStatus('idle');
      setProgress(0);
  }

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!file || !docName) return;

    // Validate file size and type
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Max 10MB allowed.');
      return;
    }
    if (!['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setError('Unsupported file type. Only PDF, JPG, and PNG are allowed.');
      return;
    }

    setStatus('uploading');
    setProgress(0);
    try {
      // Simulate progress
      let prog = 0;
      const interval = setInterval(() => {
        prog += 10;
        setProgress(prog);
        if (prog >= 100) clearInterval(interval);
      }, 120);

      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('doc_name', docName);
      formData.append('doc_type', docType);

      const res = await uploadDocument(formData);
      setProgress(100);
      setStatus('success');
      setTimeout(() => {
        router.push(`/result/${res.uid}`);
      }, 800);
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Upload failed. Please try again.');
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Dropzone */}
      <div
        {...getRootProps()}
        className={`w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
        ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-blue-600 bg-slate-800/30'}
        ${status !== 'idle' ? 'cursor-default opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
            <UploadCloud className={`w-12 h-12 mb-4 transition-colors duration-300 ${isDragActive ? 'text-blue-400' : 'text-slate-500'}`} />
            <p className="font-semibold text-slate-200">
                {isDragActive ? 'Drop the file here...' : 'Drag & drop a file here, or click to select'}
            </p>
            <p className="text-sm text-slate-500 mt-2">PDF, JPG, or PNG supported</p>
        </div>
      </div>
      
      {/* Step 2: Configure & Analyze */}
      <AnimatePresence>
        {file && (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onSubmit={handleAnalysis} 
            className="space-y-6 bg-slate-800/50 border border-slate-700 rounded-xl p-6"
          >
            {/* File Info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-700 p-3 rounded-xl">
                       <File className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-200 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                        <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                    </div>
                </div>
                <button type="button" onClick={removeFile} disabled={status === 'uploading'} className="p-2 rounded-full hover:bg-slate-700 text-slate-400 transition-colors disabled:opacity-50">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Document Name Input */}
            <div>
              <label htmlFor="doc-name" className="block text-sm font-medium text-slate-300 mb-2">Document Name</label>
              <input
                id="doc-name"
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g., Employment Contract"
                required
                disabled={status === 'uploading' || status === 'success'}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Analysis Progress & Status */}
            {(status === 'uploading' || status === 'success') && (
              <div className="space-y-2">
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <motion.div 
                        className={`h-2.5 rounded-full ${status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: 'linear' }}
                    />
                </div>
                <div className="flex items-center justify-end text-sm text-slate-400 gap-2">
                    {status === 'uploading' && <><Loader className="w-4 h-4 animate-spin" /><span>Analyzing...</span></>}
                    {status === 'success' && <><FileCheck className="w-4 h-4 text-green-500" /><span>Analysis Complete!</span></>}
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm mb-2">{error}</div>
            )}
            {/* Submit Button */}
            {status !== 'uploading' && status !== 'success' && (
              <button 
                type="submit" 
                disabled={!docName}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200"
              >
                <Zap className="w-5 h-5" />
                Analyze Document
              </button>
            )}
            {status === 'success' && (
                 <button 
                    type="button" 
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200"
                    disabled
                >
                    <FileCheck className="w-5 h-5" />
                    Analysis Complete
                </button>
            )}

          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- Main Upload Page Component ---
export default function UploadPage() {
  const benefits = [
    { icon: <Zap size={20} />, text: "Instant AI-powered analysis" },
    { icon: <ShieldCheck size={20} />, text: "Identify risks & unfavorable terms" },
    { icon: <Eye size={20} />, text: "Plain-English explanations" },
  ];

  return (
    <>
    <Header />
    <main className="min-h-screen bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-300 text-sm font-medium">Secure Analysis Platform</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tighter">
              Upload Your Document
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Get started by dropping your contract, agreement, or legal policy below. Our AI will provide a comprehensive breakdown in seconds.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            
            {/* Left Column: Upload Form */}
            <div className="lg:col-span-3">
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8 backdrop-blur-sm">
                <FileUploadForm />
              </div>
            </div>

            {/* Right Column: Key Info & Benefits */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 backdrop-blur-sm">
                <h3 className="font-semibold text-slate-100 mb-4 text-lg">Your Analysis Includes:</h3>
                <ul className="space-y-4">
                  {benefits.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                        {item.icon}
                      </div>
                      <span className="text-slate-300 text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
               <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 backdrop-blur-sm">
                <h3 className="font-semibold text-slate-100 mb-2 text-lg">Privacy Guaranteed</h3>
                <p className="text-slate-400 text-sm">
                    We use in-memory processing and never store your documents. Your data is encrypted, secure, and always private.
                </p>
              </div>
            </div>
          </div>
          
           {/* Trust Indicators */}
           <div className="mt-24 text-center">
             <p className="text-sm text-slate-500 mb-6">Trusted by legal professionals and businesses worldwide</p>
             <div className="flex justify-center items-center gap-8 opacity-40">
               <div className="h-7 w-24 bg-slate-700 rounded-md"></div>
               <div className="h-7 w-20 bg-slate-700 rounded-md"></div>
               <div className="h-7 w-28 bg-slate-700 rounded-md"></div>
               <div className="h-7 w-16 bg-slate-700 rounded-md"></div>
             </div>
           </div>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}

