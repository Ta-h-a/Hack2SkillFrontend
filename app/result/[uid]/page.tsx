"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { getResult, getClauseDetails } from "@/lib/api";
import AnalysisDashboard from "@/components/analysis/AnalysisDashboard";
import ClauseDetailModal from "@/components/analysis/ClauseDetailModal";
import ChatAssistant from "@/components/shared/ChatAssistant";

export default function ResultPage() {
  const params = useParams();
  const uid = params?.uid as string;
  // Poll every 3 seconds until status is completed
  const { data, error, isLoading } = useSWR(uid ? ["result", uid] : null, () => getResult(uid), { refreshInterval: 3000 });
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);
  const [modalClause, setModalClause] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch clause details when a clause is selected
  React.useEffect(() => {
    if (selectedClauseId && uid) {
      setModalLoading(true);
      getClauseDetails(uid, selectedClauseId)
        .then(setModalClause)
        .finally(() => setModalLoading(false));
    } else {
      setModalClause(null);
    }
  }, [selectedClauseId, uid]);

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Analyzing your document...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-red-600 text-lg mb-2">Error loading analysis.</p>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    </div>
  );
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Document Analysis</h1>
          <p className="text-sm text-gray-600 mt-1">Review clauses, negotiate terms, and export your document.</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnalysisDashboard
          clauses={data.clauses}
          onClauseClick={setSelectedClauseId}
          onGhostAdd={type => {}}
        />
        {selectedClauseId && (
          <ClauseDetailModal
            clause={modalClause}
            onClose={() => setSelectedClauseId(null)}
          />
        )}
        <ChatAssistant uid={uid} />
      </main>
    </div>
  );
}
