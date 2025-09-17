import React from "react";
import { Change } from "@/lib/types";

interface TimelineViewProps {
  changes: Change[];
  onClose: () => void;
}

export default function TimelineView({ changes, onClose }: TimelineViewProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Change Timeline</h2>
        <ul className="list-disc ml-6">
          {changes.map(change => (
            <li key={change.id} className="mb-2">
              <div className="font-semibold">{change.type}</div>
              <div className="text-xs text-gray-500">{change.timestamp}</div>
              <div className="text-sm">Affected Clauses: {change.affectedClauseIds.join(", ")}</div>
              <div className="text-xs italic">Risk Impact: {change.riskImpact}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
