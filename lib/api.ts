// Centralized API utility functions for LegalSimplifier
import type { Document, Clause, Change } from './types';


const API_BASE = 'http://localhost:8000/api/v1'; // Set to '' to use dummy data
const USE_DUMMY = !API_BASE;

export async function uploadDocument(formData: FormData): Promise<{ uid: string; status?: string; message?: string }> {

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
  throw new Error('API not available');
}

export async function getResult(uid: string): Promise<any> {

  const res = await fetch(`${API_BASE}/result/${uid}`);
  if (!res.ok) throw new Error('Result fetch failed');
  return res.json();
  throw new Error('API not available');
}

export async function getClauseDetail(uid: string, clauseId: string): Promise<any> {
  const cleanId = clauseId.replace(".txt", "");
  const res = await fetch(`${API_BASE}/clause/${uid}/${cleanId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Fetch clause detail failed');
  return res.json();
}



export async function insertGhostClause(uid: string): Promise<any> {

  const res = await fetch(`${API_BASE}/insert-ghost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid }),
  });
  if (!res.ok) throw new Error('Insert ghost clause failed');
  return res.json();
  throw new Error('API not available');
}

export async function negotiateClause(uid: string, clauseId: string, tone: string, origin:string,risk:string): Promise<{ rewritten_clause: string; risk_after: string ; ai_explanation: string}> {
  const res = await fetch(`${API_BASE}/negotiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, clauseId, tone , origin ,risk}),
  });
  if (!res.ok) throw new Error('Negotiate failed');
  return res.json();
  throw new Error('API not available');
}

export async function chatWithAssistant(uid: string, question: string, session_id?: string): Promise<{ answer: string; session_id: string }> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, question: question, session_id }),
  });
  if (!res.ok) throw new Error('Chat failed');
  return res.json();

  throw new Error('API not available');
}

export async function getSessions(): Promise<{ sessions: any[] }> {
  const res = await fetch(`${API_BASE}/sessions`);
  if (!res.ok) throw new Error('Sessions fetch failed');
  const data = await res.json();
  return { sessions: data.sessions || [] }; // fallback
}

export async function getSessionHistory(sessionId: string): Promise<{ session_id: string; history: any[] }> {
  
  const res = await fetch(`${API_BASE}/sessions/${sessionId}`);
  if (!res.ok) throw new Error('Session history fetch failed');
  return res.json();
  throw new Error('API not available');
}

export async function getSession(sessionId: string): Promise<{ session_id: string; history: any[] }> {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}`);
  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
}

export async function deleteSession(sessionId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete session: ${res.statusText}`);
  }
}

export async function getTimeline(uid: string): Promise<any[]> {
  if (USE_DUMMY) {
    return [
      {
        id: 'change-1',
        documentId: uid,
        timestamp: new Date().toISOString(),
        type: 'edit',
        affectedClauseIds: ['1.txt'],
        riskImpact: 'yellow→green',
      },
      // ...more dummy changes
    ];
  }
  /*
  const res = await fetch(`${API_BASE}/timeline/${uid}`);
  if (!res.ok) throw new Error('Timeline fetch failed');
  return res.json();
  */
  throw new Error('API not available');
}

export async function exportRedline(uid: string, options: { includeGhosts: boolean; includeEli5: boolean; watermark?: string }): Promise<Blob> {
  if (USE_DUMMY) {
    // Return a dummy PDF blob
    const dummyPdf = new Blob(["%PDF-1.4\n%Dummy PDF for ", uid], { type: 'application/pdf' });
    return dummyPdf;
  }
  /*
  const res = await fetch(`${API_BASE}/export/redline/${uid}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });
  if (!res.ok) throw new Error('Export failed');
  return res.blob();
  */
  throw new Error('API not available');
}

// ... existing functions

export const startVideoGen = async (prompt: string, uid: string) => {
    const res = await fetch(`${API_BASE}/videogen/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, uid }),
    });
    if (!res.ok) {
        throw new Error("Failed to start video generation");
    }
    return res.json();
};

export const getVideoGenStatus = async (jobId: string) => {
    const res = await fetch(`${API_BASE}/videogen/status/${jobId}`);
    if (!res.ok) {
        throw new Error("Failed to get video status");
    }
    return res.json();
};
