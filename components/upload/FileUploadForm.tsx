"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadDocument } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("pdf");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !docName) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("doc_name", docName);
    formData.append("doc_type", docType);
    try {
      const { uid } = await uploadDocument(formData);
      router.push(`/result/${uid}`);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="upload-form-title">
      <h2 id="upload-form-title" className="sr-only">Upload Document</h2>
      
      {/* File Upload Area */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Document File
          </label>
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragOver
                ? 'border-slate-400 bg-slate-50'
                : file
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              id="file-upload"
              type="file"
              accept=".pdf,image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
              required
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-describedby="file-help"
            />
            
            {file ? (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{file.name}</p>
                  <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-sm text-slate-600 hover:text-slate-800 underline"
                >
                  Choose different file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-slate-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Drop your document here</p>
                  <p className="text-sm text-slate-500">or click to browse files</p>
                </div>
                <p className="text-xs text-slate-400">Supports PDF and image files up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Document Name */}
        <div>
          <label htmlFor="doc-name" className="block text-sm font-medium text-slate-700 mb-3">
            Document Name
          </label>
          <Input
            id="doc-name"
            type="text"
            placeholder="e.g., Employment Contract, NDA, Service Agreement"
            value={docName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocName(e.target.value)}
            required
            className="w-full border-slate-300 focus:border-slate-500 focus:ring-slate-500"
            aria-describedby="name-help"
          />
          <p id="name-help" className="text-xs text-slate-500 mt-2">
            Give your document a descriptive name for easy identification
          </p>
        </div>

        {/* Document Type */}
        <div>
          <label htmlFor="doc-type" className="block text-sm font-medium text-slate-700 mb-3">
            Document Type
          </label>
          <div className="relative">
            <select
              id="doc-type"
              className="w-full appearance-none border border-slate-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
              value={docType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDocType(e.target.value)}
              aria-describedby="type-help"
            >
              <option value="pdf">PDF Document</option>
              <option value="image">Image Document</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p id="type-help" className="text-xs text-slate-500 mt-2">
            Select the format of your document
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={loading || !file || !docName} 
          className="w-full h-12 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
          aria-describedby="submit-help"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing Document...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Analyze Document</span>
            </div>
          )}
        </Button>
        <p id="submit-help" className="text-xs text-slate-500 mt-2 text-center">
          Your document will be processed securely and analyzed instantly
        </p>
      </div>
    </form>
  );
}
