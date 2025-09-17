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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading analysis.</div>;
  if (!data) return null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Document Analysis</h1>
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
    </div>
  );
}
