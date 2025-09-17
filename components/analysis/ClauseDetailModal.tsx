import React from "react";
import { Clause } from "@/lib/types";

interface ClauseDetailModalProps {
  clause: Clause | null;
  onClose: () => void;
}

export default function ClauseDetailModal({ clause, onClose }: ClauseDetailModalProps) {
  if (!clause) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-2">Clause Details</h2>
        <div className="mb-2"><span className="font-semibold">Original:</span> {clause.text}</div>
        <div className="mb-2"><span className="font-semibold">ELI5:</span> {clause.explanation}</div>
        <div className="mb-2"><span className="font-semibold">Risk:</span> {clause.risk}</div>
        <div className="mb-2"><span className="font-semibold">Alternatives:</span>
          <ul className="list-disc ml-6">
            {clause.alternatives.map((alt, i) => <li key={i}>{alt}</li>)}
          </ul>
        </div>
        <div className="mb-2"><span className="font-semibold">Legal Aid Links:</span>
          <ul className="list-disc ml-6">
            {clause.legalAids.map((aid, i) => <li key={i}><a href={aid.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{aid.name}</a></li>)}
          </ul>
        </div>
        {/* TODO: NegotiationHelper */}
      </div>
    </div>
  );
}
