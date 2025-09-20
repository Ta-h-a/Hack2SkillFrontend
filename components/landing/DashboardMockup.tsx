import React from "react";

export default function DashboardMockup() {
  return (
    <section className="w-full bg-slate-50 py-20 flex flex-col items-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">See It In Action</h2>
        <div className="rounded-2xl shadow-lg overflow-hidden border border-slate-200 bg-white">
          <div className="w-full h-72 flex items-center justify-center text-slate-400 text-xl font-semibold">
            {/* Replace with real dashboard screenshot or component later */}
            Dashboard Preview Coming Soon
          </div>
        </div>
      </div>
    </section>
  );
}
