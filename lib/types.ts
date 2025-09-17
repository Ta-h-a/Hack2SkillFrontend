// TypeScript types for LegalSimplifier entities

export type DocumentStatus = 'processing' | 'completed' | 'error';
export type ClauseRisk = 'green' | 'yellow' | 'red' | 'ghost';

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  uploadDate: string;
  status: DocumentStatus;
  userId: string;
}

export interface Clause {
  id: string;
  documentId: string;
  text: string;
  risk: ClauseRisk;
  explanation: string;
  alternatives: string[];
  legalAids: { name: string; url: string }[];
}

export interface User {
  id: string;
  profile: Record<string, unknown>;
  documentHistory: Document[];
  preferences: Record<string, unknown>;
}

export interface Change {
  id: string;
  documentId: string;
  timestamp: string;
  type: string;
  affectedClauseIds: string[];
  riskImpact: string;
}
