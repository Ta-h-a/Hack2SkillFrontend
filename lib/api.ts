// Centralized API utility functions for LegalSimplifier
import type { Document, Clause, Change } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export async function uploadDocument(formData: FormData): Promise<{ uid: string }> {
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function getResult(uid: string): Promise<{ status: string; clauses: Clause[] }> {
  const res = await fetch(`${API_BASE}/result/${uid}`);
  if (!res.ok) throw new Error('Result fetch failed');
  return res.json();
}

export async function getClauseDetails(uid: string, clauseId: string): Promise<Clause> {
  const res = await fetch(`${API_BASE}/clause/${uid}/${clauseId}`);
  if (!res.ok) throw new Error('Clause fetch failed');
  return res.json();
}

export async function insertGhostClause(uid: string, clauseType: string): Promise<Clause> {
  const res = await fetch(`${API_BASE}/insert-ghost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, clauseType }),
  });
  if (!res.ok) throw new Error('Insert ghost clause failed');
  return res.json();
}

export async function negotiateClause(uid: string, clauseId: string, tone: string): Promise<{ suggestion: string; newRisk: string }> {
  const res = await fetch(`${API_BASE}/negotiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, clauseId, tone }),
  });
  if (!res.ok) throw new Error('Negotiate failed');
  return res.json();
}

export async function chatWithAssistant(uid: string, message: string): Promise<{ response: string }> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, message }),
  });
  if (!res.ok) throw new Error('Chat failed');
  return res.json();
}

export async function getTimeline(uid: string): Promise<Change[]> {
  const res = await fetch(`${API_BASE}/timeline/${uid}`);
  if (!res.ok) throw new Error('Timeline fetch failed');
  return res.json();
}

export async function exportRedline(uid: string, options: { includeGhosts: boolean; includeEli5: boolean; watermark?: string }): Promise<Blob> {
  const res = await fetch(`${API_BASE}/export/redline/${uid}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });
  if (!res.ok) throw new Error('Export failed');
  return res.blob();
}
