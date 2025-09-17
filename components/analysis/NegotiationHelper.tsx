import React, { useState } from "react";
import { negotiateClause } from "@/lib/api";

interface NegotiationHelperProps {
  uid: string;
  clauseId: string;
}

export default function NegotiationHelper({ uid, clauseId }: NegotiationHelperProps) {
  const [tone, setTone] = useState("friendly");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNegotiate = async () => {
    setLoading(true);
    try {
      const res = await negotiateClause(uid, clauseId, tone);
      setSuggestion(res.suggestion);
    } catch {
      setSuggestion("Negotiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-md font-medium mb-3 text-gray-900">Negotiate Clause</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
          <select
            value={tone}
            onChange={e => setTone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="friendly">Friendly</option>
            <option value="firm">Firm</option>
          </select>
        </div>
        <button
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleNegotiate}
          disabled={loading}
        >
          {loading ? "Negotiating..." : "Negotiate"}
        </button>
        {suggestion && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 font-medium">Suggestion:</p>
            <p className="text-green-700 mt-1">{suggestion}</p>
          </div>
        )}
      </div>
    </div>
  );
}
