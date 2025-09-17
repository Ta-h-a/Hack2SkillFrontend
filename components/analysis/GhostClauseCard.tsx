import React from "react";
import { Clause } from "@/lib/types";

interface GhostClauseCardProps {
  clause: Clause;
  onAdd: (clauseType: string) => void;
}

export default function GhostClauseCard({ clause, onAdd }: GhostClauseCardProps) {
  return (
    <div className="border border-dashed p-4 rounded bg-gray-50 text-gray-500 flex flex-col items-center">
      <div className="font-semibold mb-1">Missing Clause</div>
      <div className="truncate text-sm mb-2">{clause.text}</div>
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        onClick={() => onAdd(clause.text)}
      >
        Add Standard Clause
      </button>
    </div>
  );
}
