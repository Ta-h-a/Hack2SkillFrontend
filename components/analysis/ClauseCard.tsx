import React from "react";
import { Clause } from "@/lib/types";

interface ClauseCardProps {
  clause: Clause;
  onClick: (clauseId: string) => void;
}

const riskColors: Record<string, string> = {
  green: "bg-green-50 border-green-200 text-green-800",
  yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
  red: "bg-red-50 border-red-200 text-red-800",
};

export default React.memo(function ClauseCard({ clause, onClick }: ClauseCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-shadow hover:shadow-md ${riskColors[clause.risk] || "bg-gray-50 border-gray-200 text-gray-800"}`}
      onClick={() => onClick(clause.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(clause.id)}
    >
      <div className="font-medium mb-2">{clause.text}</div>
      <div className="text-sm opacity-75">Risk: {clause.risk}</div>
    </div>
  );
});
