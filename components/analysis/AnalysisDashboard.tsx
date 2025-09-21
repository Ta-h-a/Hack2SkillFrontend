import React from "react";
import { Clause } from "@/lib/types";
import ClauseCard from "./ClauseCard";
import GhostClauseCard from "./GhostClauseCard";

interface AnalysisDashboardProps {
  clauses: Clause[];
  onClauseClick: (clauseId: string) => void;
  onGhostAdd: (clauseType: string) => void;
}

export default function AnalysisDashboard({ clauses, onClauseClick, onGhostAdd }: AnalysisDashboardProps) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clauses.map(clause =>
          clause.risk === "ghost" ? (
            <GhostClauseCard key={clause.id} clause={clause} onAdd={onGhostAdd} />
          ) : (
            <ClauseCard key={clause.id} clause={clause} onClick={onClauseClick} />
          )
        )}
      </div>
    </div>
  );
}
