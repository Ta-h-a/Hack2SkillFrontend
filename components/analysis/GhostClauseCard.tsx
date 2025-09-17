import React from "react";
import { Clause } from "@/lib/types";

interface GhostClauseCardProps {
  clause: Clause;
  onAdd: (clauseType: string) => void;
}

export default function GhostClauseCard({ clause, onAdd }: GhostClauseCardProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="font-medium mb-2 text-gray-700">Missing Clause</div>
      <div className="text-sm text-gray-600 truncate mb-4">{clause.text}</div>
      <button
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => onAdd(clause.text)}
      >
        Add Standard Clause
      </button>
    </div>
  );
}
