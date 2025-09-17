import React, { useState } from "react";

interface ExportControlsProps {
  onExport: (options: { includeGhosts: boolean; includeEli5: boolean; watermark?: string }) => void;
}

export default function ExportControls({ onExport }: ExportControlsProps) {
  const [includeGhosts, setIncludeGhosts] = useState(true);
  const [includeEli5, setIncludeEli5] = useState(true);
  const [watermark, setWatermark] = useState("");

  return (
    <div className="p-4">
      <label className="block mb-2">
        <input type="checkbox" checked={includeGhosts} onChange={e => setIncludeGhosts(e.target.checked)} />
        <span className="ml-2">Include ghost clauses</span>
      </label>
      <label className="block mb-2">
        <input type="checkbox" checked={includeEli5} onChange={e => setIncludeEli5(e.target.checked)} />
        <span className="ml-2">Include ELI5 explanations</span>
      </label>
      <label className="block mb-2">
        <span>Watermark:</span>
        <input type="text" className="ml-2 border px-2 py-1 rounded" value={watermark} onChange={e => setWatermark(e.target.value)} placeholder="e.g. DRAFT" />
      </label>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => onExport({ includeGhosts, includeEli5, watermark })}>
        Export PDF
      </button>
    </div>
  );
}
