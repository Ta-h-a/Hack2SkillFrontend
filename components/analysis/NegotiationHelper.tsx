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
    <div className="mt-4">
      <label className="mr-2">Tone:</label>
      <select value={tone} onChange={e => setTone(e.target.value)} className="border rounded px-2 py-1">
        <option value="friendly">Friendly</option>
        <option value="firm">Firm</option>
      </select>
      <button className="ml-2 bg-blue-500 text-white px-3 py-1 rounded" onClick={handleNegotiate} disabled={loading}>
        {loading ? "Negotiating..." : "Negotiate"}
      </button>
      {suggestion && <div className="mt-2 text-green-700">{suggestion}</div>}
    </div>
  );
}
