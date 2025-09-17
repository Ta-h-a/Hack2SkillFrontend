import React from "react";
import { Clause } from "@/lib/types";

interface ClauseDetailModalProps {
  clause: Clause | null;
  onClose: () => void;
}

export default function ClauseDetailModal({ clause, onClose }: ClauseDetailModalProps) {
  if (!clause) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Clause Details</h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Original:</span>
              <p className="mt-1 text-gray-800">{clause.text}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Explanation:</span>
              <p className="mt-1 text-gray-600">{clause.explanation}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Risk:</span>
              <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                clause.risk === 'green' ? 'bg-green-100 text-green-800' :
                clause.risk === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {clause.risk}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Alternatives:</span>
              <ul className="mt-1 ml-4 list-disc text-gray-600">
                {clause.alternatives.map((alt, i) => <li key={i}>{alt}</li>)}
              </ul>
            </div>
            <div>
              <span className="font-medium text-gray-700">Legal Aid Links:</span>
              <ul className="mt-1 ml-4 space-y-1">
                {clause.legalAids.map((aid, i) => (
                  <li key={i}>
                    <a
                      href={aid.url}
                      className="text-blue-600 hover:text-blue-800 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {aid.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
