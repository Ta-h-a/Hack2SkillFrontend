import React from "react";
import { Clause } from "@/lib/types";

interface ClauseCardProps {
  clause: Clause;
  onClick: (clauseId: string) => void;
}

const riskColors: Record<string, string> = {
  green: "bg-green-100 border-green-400",
  yellow: "bg-yellow-100 border-yellow-400",
  red: "bg-red-100 border-red-400",
};

export default function ClauseCard({ clause, onClick }: ClauseCardProps) {
  return (
    <div
      className={`border p-4 rounded cursor-pointer mb-2 ${riskColors[clause.risk] || "bg-gray-100 border-gray-300"}`}
      onClick={() => onClick(clause.id)}
    >
      <div className="font-semibold mb-1">Clause</div>
      <div className="truncate text-sm">{clause.text}</div>
      <div className="text-xs mt-2 italic">Risk: {clause.risk}</div>
    </div>
  );
}
