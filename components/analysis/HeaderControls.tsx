import React from "react";

interface HeaderControlsProps {
  onViewHistory: () => void;
  onDownload: () => void;
}

export default function HeaderControls({ onViewHistory, onDownload }: HeaderControlsProps) {
  return (
    <div className="flex gap-2">
      <button className="bg-gray-200 px-3 py-1 rounded" onClick={onViewHistory}>View History</button>
      <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={onDownload}>Download</button>
    </div>
  );
}
