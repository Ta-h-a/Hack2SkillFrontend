import React, { useState } from "react";
import useSWR from "swr";
import { getSessions, getSessionHistory } from "@/lib/api";

interface SessionsSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSessionSelect: (sessionId: string | undefined) => void;
  selectedSessionId?: string;
}

export default function SessionsSidebar({ isOpen, onToggle, onSessionSelect, selectedSessionId }: SessionsSidebarProps) {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Fetch sessions list
  const { data: sessions, error: sessionsError } = useSWR("sessions", getSessions);

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

  if (!isOpen) return null;

  return (
    <>
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Chat Sessions</h2>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded"
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
          {!sessions ? (
            <div className="text-gray-500 text-sm">Loading sessions...</div>
          ) : sessions.sessions.length === 0 ? (
            <div className="text-gray-500 text-sm">No sessions found</div>
          ) : (
            <div className="space-y-2">
              {sessions.sessions.map((session: any) => (
                <div key={session.session_id} className="border rounded-xl">
                  <button
                    onClick={() => handleSessionClick(session.session_id)}
                    className={`w-full p-3 text-left rounded-xl transition-colors ${
                      selectedSessionId === session.session_id ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                    } hover:bg-gray-50`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{session.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(session.last_updated).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExpand(session.session_id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <svg 
                          className={`w-4 h-4 transition-transform ${expandedSessionId === session.session_id ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </button>
                  
                  {expandedSessionId === session.session_id && sessionHistory && (
                    <div className="px-3 pb-3 mt-2 border-t pt-2">
                      <div className="text-xs text-gray-600 mb-2">Recent messages:</div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {sessionHistory.history.slice(-3).map((msg: any, i: number) => (
                          <div key={i} className="text-xs p-2 bg-gray-50 rounded">
                            <div className="font-medium text-gray-700">{msg.role}:</div>
                            <div className="text-gray-600 truncate">{msg.content}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
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