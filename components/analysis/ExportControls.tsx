import React, { useState } from "react";

interface ExportControlsProps {
  onExport: (options: { includeGhosts: boolean; includeEli5: boolean; watermark?: string }) => void;
}

export default function ExportControls({ onExport }: ExportControlsProps) {
  const [includeGhosts, setIncludeGhosts] = useState(true);
  const [includeEli5, setIncludeEli5] = useState(true);
  const [watermark, setWatermark] = useState("");

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <h3 className="text-lg font-medium mb-4 text-gray-900">Export Options</h3>
      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeGhosts}
            onChange={e => setIncludeGhosts(e.target.checked)}
            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">Include ghost clauses</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeEli5}
            onChange={e => setIncludeEli5(e.target.checked)}
            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">Include explanations</span>
        </label>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Watermark</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={watermark}
            onChange={e => setWatermark(e.target.value)}
            placeholder="e.g. DRAFT"
          />
        </div>
      </div>
      <button
        className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => onExport({ includeGhosts, includeEli5, watermark })}
      >
        Export PDF
      </button>
    </div>
  );
}
