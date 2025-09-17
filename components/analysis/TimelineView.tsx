import React from "react";
import { Change } from "@/lib/types";

interface TimelineViewProps {
  changes: Change[];
  onClose: () => void;
}

export default function TimelineView({ changes, onClose }: TimelineViewProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          onClick={onClose}
          aria-label="Close timeline"
        >
          &times;
        </button>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Change Timeline</h2>
          <div className="space-y-4">
            {changes.map(change => (
              <div key={change.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="font-medium text-gray-900">{change.type}</div>
                <div className="text-sm text-gray-500 mt-1">{new Date(change.timestamp).toLocaleString()}</div>
                <div className="text-sm text-gray-700 mt-1">Affected Clauses: {change.affectedClauseIds.join(", ")}</div>
                <div className="text-sm text-gray-600 mt-1 italic">Risk Impact: {change.riskImpact}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
