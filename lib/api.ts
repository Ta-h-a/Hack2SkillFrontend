// Centralized API utility functions for LegalSimplifier
import type { Document, Clause, Change } from './types';


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const USE_DUMMY = !API_BASE;

export async function uploadDocument(formData: FormData): Promise<{ uid: string; status?: string; message?: string }> {
  if (USE_DUMMY) {
    return {
      uid: 'dummy-uid-1234',
      status: 'completed',
      message: 'Clauses saved successfully in store/dummy-uid-1234',
    };
  }
  // Real API call
  /*
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
  */
  throw new Error('API not available');
}

export async function getResult(uid: string): Promise<any> {
  if (USE_DUMMY) {
    // Return dummy clause analysis array (see spec)
    return [
      {
        rating: 'yellow',
        severity: 2,
        detailed_rationale: 'The clause grants broad usage rights without specifying any restrictions or limitations on the Lessee\'s activities. This could lead to ambiguity regarding the scope of acceptable use and the potential for disputes.',
        risky_phrases: ["'both residential and commercial purposes'"],
        risk_types: ['Operational'],
        confidence: 'medium',
        original_clause: '1. The Lessee may use the premises for both residential and commercial purposes.',
        id: '1.txt',
      },
      {
        rating: 'red',
        severity: 9,
        detailed_rationale: 'The clause requires arbitration in accordance with rules decided solely by the Lessor, which may be biased towards their interests. This creates an uneven playing field and raises concerns about the fairness of the arbitration process. Additionally, the arbitration rules may lack transparency and accountability. This may lead to material losses for the user.',
        risky_phrases: ["'rules decided solely by the Lessor'"],
        risk_types: ['Regulatory', 'Liability', 'Reputational'],
        confidence: 'high',
        original_clause: '10. Any disputes not resolved in court shall be referred to arbitration in accordance with rules decided solely by the Lessor.',
        id: '10.txt',
      },
      // Ghost clauses (missing clauses detected by AI)
      {
        rating: 'ghost',
        id: 'ghost-default-termination',
        original_clause: 'Missing: Default and Termination Clause',
        text: 'Missing: Default and Termination Clause',
        detailed_rationale: 'Your contract is missing essential default and termination provisions. This leaves both parties unclear about what happens if terms are breached.',
        clause_name: 'Default and Termination Clauses',
        description: 'Standard clauses outlining circumstances and procedures for lease termination due to breach.',
        reason: 'Critical for protecting your rights and establishing clear termination procedures.',
      },
      {
        rating: 'ghost',
        id: 'ghost-insurance-liability',
        original_clause: 'Missing: Insurance and Liability Clause',
        text: 'Missing: Insurance and Liability Clause',
        detailed_rationale: 'No insurance or liability provisions found. This creates significant risk exposure for both parties.',
        clause_name: 'Insurance and Liability Coverage',
        description: 'Essential clauses defining insurance requirements and liability responsibilities.',
        reason: 'Protects both parties from potential financial losses and clarifies responsibility.',
      },
      {
        rating: 'ghost',
        id: 'ghost-maintenance-repairs',
        original_clause: 'Missing: Maintenance and Repair Responsibilities',
        text: 'Missing: Maintenance and Repair Responsibilities',
        detailed_rationale: 'Contract lacks clear maintenance and repair obligations, which can lead to disputes and property deterioration.',
        clause_name: 'Maintenance and Repair Responsibilities',
        description: 'Clear division of maintenance duties between parties.',
        reason: 'Prevents disputes and ensures property is properly maintained.',
      },
    ];
  }
  /*
  const res = await fetch(`${API_BASE}/result/${uid}`);
  if (!res.ok) throw new Error('Result fetch failed');
  return res.json();
  */
  throw new Error('API not available');
}

export async function getClauseDetails(uid: string, clauseId: string): Promise<any> {
  if (USE_DUMMY) {
    return {
      clause_id: 0,
      original_text: '1. The Lessee may use the premises for both residential and commercial purposes.',
      risk: 'yellow',
      eli5: "This clause lets the lessee use the property for both living and business, but it's not clear what happens if they do something wrong.",
      rewrite_options: [
        'The Lessee may use the premises for residential purposes, subject to obtaining prior written approval from the Lessor for any commercial use.',
        'The Lessee may use the premises for commercial purposes, subject to obtaining prior written approval from the Lessor for any residential use.'
      ],
      ai_response: "We can't agree to this. We want the flexibility to use the property as we see fit without needing approval from the Lessor.",
      risk_after: 'green',
      next_actions: ['Accept', 'Counter', 'Ask-human-lawyer'],
      legal_aids: [
        { name: 'Community Law Centre', type: 'community', url: 'https://communitylaw.example' },
        { name: 'QuickCall Lawyer', type: 'private', url: 'https://quickcall.example' }
      ],
      video_script: {
        title: 'Clause explainer',
        script_lines: [
          'This clause sets rules between parties.',
          'Understand before signing.'
        ]
      },
      banner: null
    };
  }
  /*
  const res = await fetch(`${API_BASE}/clause/${uid}/${clauseId}`);
  if (!res.ok) throw new Error('Clause fetch failed');
  return res.json();
  */
  throw new Error('API not available');
}

export async function insertGhostClause(uid: string): Promise<any> {
  if (USE_DUMMY) {
    return {
      uid,
      missing_clauses: [
        {
          clause_name: "Clauses for Default and Termination by Lessee",
          description: "Clauses outlining the circumstances and procedures for the Lessee's default or termination of the lease.",
          reason: "These clauses are essential to protect the Lessor's interests and provide clarity on the Lessee's obligations."
        },
        {
          clause_name: "Clause for Insurance and Liability",
          description: "Clause outlining the Lessee's responsibility for maintaining insurance and liability for damages to the premises.",
          reason: "This clause helps to protect the Lessor from potential losses and ensures the Lessee is accountable for their actions."
        },
        {
          clause_name: "Clause for Utilities and Services",
          description: "Clause outlining the Lessee's responsibility for paying for utilities and services, such as electricity, water, and gas.",
          reason: "This clause clarifies the Lessee's financial obligations and helps prevent disputes over utility bills."
        },
        {
          clause_name: "Clause for Dispute Resolution and Arbitration",
          description: "Clause outlining the procedures for resolving disputes and the process for arbitration, including the binding nature of arbitration decisions.",
          reason: "This clause helps to prevent costly and time-consuming litigation and promotes a fair and efficient dispute resolution process."
        },
        {
          clause_name: "Clause for Governing Law and Jurisdiction",
          description: "Clause outlining the governing law and jurisdiction for the contract, including the applicable laws and courts.",
          reason: "This clause ensures that the contract is interpreted and enforced in accordance with the laws of the relevant jurisdiction and provides clarity on the applicable legal framework."
        }
      ]
    };
  }
  /*
  const res = await fetch(`${API_BASE}/insert-ghost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, clauseType }),
  });
  if (!res.ok) throw new Error('Insert ghost clause failed');
  return res.json();
  */
  throw new Error('API not available');
}

export async function negotiateClause(uid: string, clauseId: string, tone: string): Promise<{ suggestion: string; newRisk: string }> {
  if (USE_DUMMY) {
    return {
      suggestion: `Dummy negotiation suggestion for clause ${clauseId} with tone ${tone}.`,
      newRisk: 'green',
    };
  }
  /*
  const res = await fetch(`${API_BASE}/negotiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, clauseId, tone }),
  });
  if (!res.ok) throw new Error('Negotiate failed');
  return res.json();
  */
  throw new Error('API not available');
}

export async function chatWithAssistant(uid: string, question: string, session_id?: string): Promise<{ answer: string; session_id: string }> {
  if (USE_DUMMY) {
    // Generate more realistic responses based on common legal questions
    const responses = [
      "Based on your document, this clause means that you're agreeing to resolve disputes through arbitration rather than going to court. This can be faster and less expensive, but you may give up certain legal rights.",
      "This termination clause allows the landlord to end the lease if you breach the terms. I'd recommend negotiating for a cure period - time to fix the issue before termination.",
      "The liability waiver here is quite broad. You might want to negotiate to limit it to specific situations rather than all potential damages.",
      "This interest rate clause seems high. Market rates are typically lower - you may have room to negotiate better terms.",
      "The renewal clause automatically extends your lease unless you give notice. Make sure you understand the notice period required.",
      "This indemnification clause makes you responsible for legal costs if certain issues arise. Consider limiting the scope to exclude your own negligence."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      answer: question.toLowerCase().includes('hello') || question.toLowerCase().includes('hi') 
        ? "Hello! I'm here to help you understand your legal document. Feel free to ask me about any clauses, terms, or concerns you have."
        : randomResponse,
      session_id: session_id || `session-${Date.now()}`,
    };
  }
  /*
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, message: question, session_id }),
  });
  if (!res.ok) throw new Error('Chat failed');
  return res.json();
  */
  throw new Error('API not available');
}

export async function getSessions(): Promise<{ sessions: any[] }> {
  if (USE_DUMMY) {
    return {
      sessions: [
        {
          session_id: 'dummy-session-id-1',
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          title: 'Lease Agreement Questions',
          last_message: 'What does this arbitration clause mean?',
        },
        {
          session_id: 'dummy-session-id-2',
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          title: 'Contract Risk Analysis',
          last_message: 'How can I negotiate this clause?',
        },
      ],
    };
  }
  /*
  const res = await fetch(`${API_BASE}/sessions`);
  if (!res.ok) throw new Error('Sessions fetch failed');
  return res.json();
  */
  throw new Error('API not available');
}

export async function getSessionHistory(sessionId: string): Promise<{ session_id: string; history: any[] }> {
  if (USE_DUMMY) {
    const historyData = {
      'dummy-session-id-1': [
        {
          role: 'user',
          content: 'What does this arbitration clause mean?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          role: 'assistant',
          content: 'This arbitration clause means that any disputes will be resolved through arbitration rather than court proceedings. While arbitration can be faster and less expensive, it may limit your legal rights and appeal options.',
          timestamp: new Date(Date.now() - 3580000).toISOString(),
        },
        {
          role: 'user', 
          content: 'Is this clause risky for me?',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          role: 'assistant',
          content: 'Yes, this clause has several concerning aspects. The arbitration rules heavily favor the lessor, and you waive your right to a jury trial. I recommend negotiating for mutual arbitration rules.',
          timestamp: new Date(Date.now() - 1780000).toISOString(),
        },
      ],
      'dummy-session-id-2': [
        {
          role: 'user',
          content: 'Can you explain the rent increase clause?',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          role: 'assistant',
          content: 'The rent increase clause allows the landlord to raise rent annually by up to 5%. This is relatively reasonable, but you might want to negotiate a cap tied to inflation rates.',
          timestamp: new Date(Date.now() - 86380000).toISOString(),
        },
      ],
      'dummy-session-id-3': [
        {
          role: 'user',
          content: 'What should I watch out for in this contract?',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          role: 'assistant',
          content: 'The main red flags I see are: 1) Broad liability waiver, 2) Unfavorable arbitration clause, 3) Automatic renewal without clear notice requirements. Focus on negotiating these areas.',
          timestamp: new Date(Date.now() - 172780000).toISOString(),
        },
      ]
    };

    return {
      session_id: sessionId,
      history: historyData[sessionId as keyof typeof historyData] || [],
    };
  }
  /*
  const res = await fetch(`${API_BASE}/sessions/${sessionId}`);
  if (!res.ok) throw new Error('Session history fetch failed');
  return res.json();
  */
  throw new Error('API not available');
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
