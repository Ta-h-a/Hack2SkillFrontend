import React from "react";
import Link from "next/link";
import { WebGLShader } from "@/components/ui/web-gl-shader";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-slate-900 text-white overflow-hidden min-h-screen flex items-center">
      {/* WebGL Background Animation */}
      <WebGLShader />
      
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-blue-300 text-sm font-medium">AI-Powered Legal Analysis</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-6">
                Simplify Legal
                <br />
                <span className="text-blue-400">Documents</span>
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-lg">
                Upload contracts and get instant AI-powered analysis with plain-English explanations, risk assessments, and negotiation guidance.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/upload">
                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-8 py-4 text-lg transition-all duration-200 hover:scale-105 border border-blue-500">
                  Upload Document
                </button>
              </Link>
              <button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl px-8 py-4 text-lg transition-all duration-200 border border-slate-600">
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-slate-700">
              <p className="text-slate-400 text-sm mb-4">Trusted by legal professionals</p>
              <div className="flex items-center gap-6 opacity-60">
                <div className="h-6 w-20 bg-slate-600 rounded"></div>
                <div className="h-6 w-24 bg-slate-600 rounded"></div>
                <div className="h-6 w-16 bg-slate-600 rounded"></div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="relative lg:block">
            <div className="relative">
              {/* Main Visual Container */}
              <div className="relative bg-slate-800/50 rounded-2xl border border-slate-700 p-8 backdrop-blur-sm">
                <div className="space-y-4">
                  {/* Simulated Document Analysis */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-slate-300 font-medium">Contract Analysis</span>
                  </div>
                  
                  {/* Risk Level Indicators */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <span className="text-green-300 text-sm">Payment Terms</span>
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Low Risk</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                      <span className="text-yellow-300 text-sm">Liability Clause</span>
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Medium Risk</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <span className="text-red-300 text-sm">Termination Terms</span>
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">High Risk</span>
                    </div>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="mt-6 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-slate-400 text-sm">Analysis Progress</span>
                      <span className="text-blue-400 text-sm font-medium">98%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full w-[98%] transition-all duration-1000"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/20 rounded-full border border-blue-500/30 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
