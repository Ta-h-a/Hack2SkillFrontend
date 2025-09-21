import React, { useState } from "react"; // Import useState
import { Clause } from "@/lib/types";
import ClauseCard from "./ClauseCard";
import GhostClauseCard from "./GhostClauseCard";

interface AnalysisDashboardProps {
  clauses: Clause[];
  onClauseClick: (clauseId: string) => void;
  onGhostAdd: (clauseType: string) => void;
}

export default function AnalysisDashboard({ clauses, onClauseClick, onGhostAdd }: AnalysisDashboardProps) {
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);

  const handleClauseClick = (clauseId: string) => {
    setSelectedClauseId(clauseId);
    onClauseClick(clauseId);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clauses.map(clause =>
          clause.risk === "ghost" ? (
            <GhostClauseCard key={clause.id} clause={clause} onAdd={onGhostAdd} />
          ) : (
            <ClauseCard
              key={clause.id}
              clause={clause}
              onClick={handleClauseClick} // Use the new handler
              isSelected={clause.id === selectedClauseId} // Pass the isSelected prop
            />
          )
        )}
      </div>
    </div>
  );
}