import React from "react";

interface HeaderControlsProps {
  onViewHistory: () => void;
  onDownload: () => void;
}

export default function HeaderControls({ onViewHistory, onDownload }: HeaderControlsProps) {
  return (
    <div className="flex gap-3">
      <button
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        onClick={onViewHistory}
      >
        View History
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={onDownload}
      >
        Download
      </button>
    </div>
  );
}
