import React, { useState } from "react";
import useSWR from "swr";
import { getSessions, getSessionHistory } from "@/lib/api";
import { MoreVertical, Trash2 } from "lucide-react";

// --- Helper function for session title fallback logic ---
const getSessionTitle = (session: any): string => {
  // If session.title exists → use it
  if (session?.title) {
    return session.title;
  }
  
  // Prefer session.firstMessage or session.history[0].content
  const firstMessage = session?.firstMessage || 
                      (session?.history?.[0]?.content ?? "");
  
  if (firstMessage) {
    return firstMessage.length > 30 
      ? `${firstMessage.substring(0, 30)}…` 
      : firstMessage;
  }
  
  // Else if session.session_id exists → show Session ${session.session_id.slice(0,6)}
  if (session?.session_id) {
    return `Session ${session.session_id.slice(0, 6)}`;
  }
  
  // Else if session is a string (raw session ID) → show Session ${session.slice(0,6)}
  if (typeof session === 'string') {
    return `Session ${session.slice(0, 6)}`;
  }
  
  // Final fallback → "New Session"
  return "New Session";
};

// --- Helper function to get full first message for tooltip ---
const getSessionTooltip = (session: any): string => {
  // Prefer session.firstMessage or session.history[0].content for full message
  const firstMessage = session?.firstMessage || 
                      (session?.history?.[0]?.content ?? "");
  
  if (firstMessage) {
    return firstMessage;
  }
  
  // Fallback to session title or session ID
  return getSessionTitle(session);
};

interface SessionsSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSessionSelect: (sessionId: string | undefined) => void;
  onDeleteSession: (sessionId: string) => void;
  selectedSessionId?: string;
  sessions: { session_id: string, title?: string, history?: any[], firstMessage?: string }[];
}

export default function SessionsSidebar({ isOpen, onToggle, onSessionSelect, onDeleteSession, selectedSessionId, sessions }: SessionsSidebarProps) {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Fetch history for expanded session
  const { data: sessionHistory } = useSWR(
    expandedSessionId ? ["session-history", expandedSessionId] : null,
    async () => {
      if (!expandedSessionId) return null;
      return await getSessionHistory(expandedSessionId);
    }
  );

  const handleSessionClick = (sessionId: string) => {
    onSessionSelect(sessionId);
  };

  const handleToggleExpand = (sessionId: string) => {
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  };

  const handleNewSession = () => {
    onSessionSelect(undefined);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdownId]);

  if (!isOpen) return null;

  return (
    <>
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-700 shadow-lg z-40 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Chat Sessions</h2>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleNewSession}
            className="mt-2 w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
          >
            + New Session
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {sessions.length === 0 ? (
            <div className="text-slate-400 text-sm">No sessions available</div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session: any) => {
                // Handle both raw session IDs (strings) and session objects
                const sessionId = typeof session === 'string' ? session : session.session_id;
                const sessionObj = typeof session === 'string' ? { session_id: session } : session;
                
                 return (
                   <div key={sessionId} className="border border-slate-600 rounded-xl">
                     <div className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                       selectedSessionId === sessionId ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                     }`}>
                       {/* Session title - clickable */}
                       <button
                         onClick={() => handleSessionClick(sessionId)}
                         title={getSessionTooltip(sessionObj)}
                         className="flex-1 text-left"
                       >
                         <div className={`font-medium text-sm ${selectedSessionId === sessionId ? 'text-white' : 'text-slate-200'}`}>
                           {getSessionTitle(sessionObj)}
                         </div>
                       </button>
                       
                       {/* 3-dot menu */}
                       <div className="ml-2 relative">
                         <button 
                           className="p-1 rounded hover:bg-slate-600 text-slate-400 hover:text-white"
                           onClick={(e) => {
                             e.stopPropagation();
                             setOpenDropdownId(openDropdownId === sessionId ? null : sessionId);
                           }}
                         >
                           <MoreVertical size={16} />
                         </button>
                         {openDropdownId === sessionId && (
                           <div className="absolute right-0 mt-1 bg-slate-700 border border-slate-600 rounded shadow-lg z-10 min-w-[120px]">
                             <button
                               className="flex items-center px-3 py-2 text-sm hover:bg-slate-600 w-full text-slate-200 hover:text-white"
                              onClick={async (e) => {
                                e.stopPropagation();
                                setOpenDropdownId(null);
                                await onDeleteSession(sessionId);
                              }}
                             >
                               <Trash2 size={14} className="mr-2" /> Delete
                             </button>
                           </div>
                         )}
                       </div>
                       
                       {/* Expand button */}
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           handleToggleExpand(sessionId);
                         }}
                         className="p-1 hover:bg-slate-600 rounded text-slate-400 hover:text-white ml-1"
                       >
                         <svg 
                           className={`w-4 h-4 transition-transform ${expandedSessionId === sessionId ? 'rotate-180' : ''}`}
                           fill="none" 
                           stroke="currentColor" 
                           viewBox="0 0 24 24"
                         >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                         </svg>
                       </button>
                     </div>
                  
                  {expandedSessionId === sessionId && sessionHistory && (
                    <div className="px-3 pb-3 mt-2 border-t border-slate-600 pt-2">
                      <div className="text-xs text-slate-400 mb-2">Recent messages:</div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {sessionHistory.history.slice(-3).map((msg: any, i: number) => (
                          <div key={i} className="text-xs p-2 bg-slate-700 rounded">
                            <div className="font-medium text-slate-300">{msg.role}:</div>
                            <div className="text-slate-400 truncate">{msg.content}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={onToggle}
      />
    </>
  );
}