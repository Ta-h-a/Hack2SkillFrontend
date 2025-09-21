"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, X, Loader2, MessageSquare, Plus } from 'lucide-react';
import { cx } from "class-variance-authority";
import { ChatLoader } from "@/components/ui/chat-loader";
import { chatWithAssistant, getSessions, getSessionHistory } from '@/lib/api';
// --- MOCK APIs & UTILS ---
// const mockGetSessions = async (): Promise<{ sessions: { session_id: string, title: string, last_updated: string }[] }> => {
//     await new Promise(res => setTimeout(res, 500));
//     return {
//         sessions: [
//             { session_id: 'sid_123', title: 'NDA Analysis from yesterday', last_updated: new Date(Date.now() - 86400000).toISOString() },
//             { session_id: 'sid_456', title: 'Service Agreement Review', last_updated: new Date(Date.now() - 172800000).toISOString() },
//         ]
//     };
// };
// const mockGetSessionHistory = async (sessionId: string): Promise<{ history: { role: string, content: string }[] }> => {
//     await new Promise(res => setTimeout(res, 300));
//     return {
//         history: [
//             { role: 'user', content: 'What is the governing law?' },
//             { role: 'assistant', content: 'The governing law for this agreement is the State of Delaware.' }
//         ]
//     };
// };
// const mockChatWithAssistant = async (uid: string, question: string, sessionId?: string): Promise<{ answer: string, session_id: string }> => {
//     await new Promise(res => setTimeout(res, 1500));
//     const newSessionId = sessionId || `sid_${Date.now()}`;
//     return {
//         answer: `Regarding your question about "${question.substring(0, 20)}...", this is the AI's simulated response.`,
//         session_id: newSessionId,
//     };
// };
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');


// --- CHAT HELPER COMPONENTS ---
const ChatMessage = ({ role, text }: { role: string, text: string }) => {
    const isUser = role === "user";
    return (
        <motion.div layout initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} transition={{ duration: 0.3, ease: "easeOut" }} className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && (<div className="w-8 h-8 flex-shrink-0 bg-slate-800 border border-slate-700/50 rounded-full flex items-center justify-center mt-1"><Bot className="w-5 h-5 text-blue-400" /></div>)}
            <div className={`max-w-md px-4 py-3 rounded-2xl ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}><p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p></div>
        </motion.div>
    );
};


// --- AI INPUT COMPONENTS (New) ---
const ColorOrb = ({ dimension = "192px", className = "", spinDuration = 20 }: { dimension?: string; className?: string; spinDuration?: number }) => {
  const palette = { base: "oklch(9% 0.01 264.695)", accent1: "#3b82f6", accent2: "#60a5fa", accent3: "#1e40af" };
  return (
    <div className={cn("color-orb", className)} style={{ width: dimension, height: dimension, "--base": palette.base, "--accent1": palette.accent1, "--accent2": palette.accent2, "--accent3": palette.accent3, "--spin-duration": `${spinDuration}s`, "--blur": `4px`, "--contrast": 1.5, "--dot": `0.1px`, "--shadow": `2px`, "--mask": "25%" } as React.CSSProperties}>
      <style jsx>{`
        @property --angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
        .color-orb { display: grid; grid-template-areas: "stack"; overflow: hidden; border-radius: 50%; position: relative; transform: scale(1.1); }
        .color-orb::before, .color-orb::after { content: ""; display: block; grid-area: stack; width: 100%; height: 100%; border-radius: 50%; transform: translateZ(0); }
        .color-orb::before { background: conic-gradient(from calc(var(--angle) * 2) at 25% 70%, var(--accent3), transparent 20% 80%, var(--accent3)), conic-gradient(from calc(var(--angle) * 2) at 45% 75%, var(--accent2), transparent 30% 60%, var(--accent2)), conic-gradient(from calc(var(--angle) * -3) at 80% 20%, var(--accent1), transparent 40% 60%, var(--accent1)), conic-gradient(from calc(var(--angle) * 2) at 15% 5%, var(--accent2), transparent 10% 90%, var(--accent2)), conic-gradient(from calc(var(--angle) * 1) at 20% 80%, var(--accent1), transparent 10% 90%, var(--accent1)), conic-gradient(from calc(var(--angle) * -2) at 85% 10%, var(--accent3), transparent 20% 80%, var(--accent3)); box-shadow: inset var(--base) 0 0 var(--shadow) calc(var(--shadow) * 0.2); filter: blur(var(--blur)) contrast(var(--contrast)); animation: spin var(--spin-duration) linear infinite; }
        .color-orb::after { background-image: radial-gradient(circle at center, var(--base) var(--dot), transparent var(--dot)); background-size: calc(var(--dot) * 2) calc(var(--dot) * 2); backdrop-filter: blur(calc(var(--blur) * 2)) contrast(calc(var(--contrast) * 2)); mix-blend-mode: overlay; mask-image: radial-gradient(black var(--mask), transparent 75%); }
        @keyframes spin { to { --angle: 360deg; } }
      `}</style>
    </div>
  );
};

const FormContext = React.createContext({} as { showForm: boolean; triggerOpen: () => void; triggerClose: () => void; });
const useFormContext = () => React.useContext(FormContext);
const FORM_WIDTH = 420; const FORM_HEIGHT = 220;

const KeyHint = ({ children, className }: { children: string; className?: string }) => (<kbd className={cx("text-slate-400 flex h-6 w-fit items-center justify-center rounded border border-slate-700 bg-slate-800 px-[6px] font-sans text-xs", className)}>{children}</kbd>);

const InputForm = React.forwardRef<HTMLTextAreaElement, { onSuccess: (value: string) => void }>(({ onSuccess }, ref) => {
  const { triggerClose, showForm } = useFormContext();
  const formRef = React.useRef<HTMLFormElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); const formData = new FormData(e.currentTarget); const message = formData.get("message") as string; if (message.trim()) { onSuccess(message); } };
  const handleKeys = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === "Escape") triggerClose(); if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); formRef.current?.requestSubmit(); } };
  return (
<form ref={formRef} onSubmit={handleSubmit} className="absolute bottom-0" style={{ width: FORM_WIDTH, height: FORM_HEIGHT, pointerEvents: showForm ? "all" : "none" }}>
  <AnimatePresence>
    {showForm && (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: 10 }} 
        transition={{ type: "spring", stiffness: 400, damping: 40 }} 
        className="flex h-full flex-col p-2"
      >
        <div className="flex justify-between py-1.5 items-center px-2">
          <p className="text-blue-400 z-2 ml-[38px] flex items-center gap-2 select-none text-sm font-semibold">
            <Bot size={16} />
            Ask Legal AI
          </p>
          <button type="submit" className="text-slate-400 right-4 flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-transparent pr-1 text-center select-none group">
            <KeyHint>⌘</KeyHint>
            <KeyHint>Enter</KeyHint>
          </button>
        </div>
        <div className="relative h-full w-full bg-slate-800/50 border border-slate-700/80 rounded-xl p-0.5">
           <textarea 
             ref={ref} 
             placeholder="Explain the key risks in this document..." 
             name="message" 
             className="h-full w-full resize-none scroll-py-2 rounded-md p-3 outline-0 bg-transparent text-slate-200 placeholder:text-slate-500 focus:bg-slate-800/30 transition-colors"
             required 
             onKeyDown={handleKeys} 
             spellCheck={false}
           />
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mt-2"></div>
      </motion.div>
    )}
  </AnimatePresence>
  <AnimatePresence>
    {showForm && (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        transition={{ duration: 0.2 }} 
        className="absolute top-[15px] left-[23px]"
      >
        <ColorOrb dimension="24px" />
      </motion.div>
    )}
  </AnimatePresence>
</form>

  );
});
InputForm.displayName = "InputForm";

const DockBar = () => {
  const { showForm, triggerOpen } = useFormContext();
  return (
    <footer className="mt-auto flex h-[44px] items-center justify-center whitespace-nowrap select-none">
      <motion.button type="button" className="flex h-fit flex-1 items-center justify-start rounded-full px-3 py-1 gap-2" onClick={triggerOpen} initial={false} animate={{ color: showForm ? "#94a3b8" : "#f1f5f9" }}>
        <AnimatePresence mode="wait">{!showForm && <motion.div key="orb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><ColorOrb dimension="24px" /></motion.div>}</AnimatePresence>
                <span className="truncate text-sm font-medium">Ask Legal AI</span>

      </motion.button>
    </footer>
  );
};

const AIInput = ({ onSend }: { onSend: (value: string) => void}) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [showForm, setShowForm] = useState(false);
    const triggerClose = useCallback(() => { setShowForm(false); textareaRef.current?.blur(); }, []);
    const triggerOpen = useCallback(() => { setShowForm(true); setTimeout(() => textareaRef.current?.focus(), 100); }, []);
    const handleSuccess = useCallback((value: string) => { triggerClose(); onSend(value); }, [triggerClose, onSend]);
    useEffect(() => { const handler = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node) && showForm) { triggerClose(); } }; document.addEventListener("mousedown", handler); return () => document.removeEventListener("mousedown", handler); }, [showForm, triggerClose]);
    const ctx = useMemo(() => ({ showForm, triggerOpen, triggerClose }), [showForm, triggerOpen, triggerClose]);
    return(<div className="flex items-center justify-center w-full h-full"><FormContext.Provider value={ctx}><motion.div ref={wrapperRef} className="bg-slate-900/80 relative z-3 flex flex-col items-center overflow-hidden border border-slate-700" initial={false} animate={{ width: showForm ? FORM_WIDTH : "auto", height: showForm ? FORM_HEIGHT : 44, borderRadius: showForm ? 16 : 22 }} transition={{ type: "spring", stiffness: 450, damping: 40 }}><DockBar /><InputForm ref={textareaRef} onSuccess={handleSuccess} /></motion.div></FormContext.Provider></div>);
};

// --- Main Chat Assistant Component ---
interface ChatModalProps { uid: string; isOpen: boolean; onClose: () => void; }

const ChatModal = ({ uid, isOpen, onClose }: ChatModalProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<{ session_id: string, title: string, last_updated: string }[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(undefined);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (isOpen) { getSessions().then(data => setSessions(data.sessions)); } }, [isOpen]);
  useEffect(() => { if(selectedSessionId) { setMessages([]); getSessionHistory(selectedSessionId).then(data => setMessages(data.history.map((msg: any) => ({ role: msg.role, text: msg.content })))); } else { setMessages([]); } }, [selectedSessionId]);
  useEffect(() => { if(scrollAreaRef.current) { scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight; } }, [messages, loading]);

  const handleNewSession = () => setSelectedSessionId(undefined);
  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || loading) return;
    setMessages(msgs => [...msgs, { role: "user", text: messageText }]); setLoading(true); setInput("");
    try {
      const res = await chatWithAssistant(uid, messageText, selectedSessionId);
      setMessages(msgs => [...msgs, { role: "assistant", text: res.answer }]);
      if (!selectedSessionId) { setSelectedSessionId(res.session_id); getSessions().then(data => setSessions(data.sessions)); }
    } catch { setMessages(msgs => [...msgs, { role: "assistant", text: "Sorry, an error occurred." }]); } 
    finally { setLoading(false); }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="w-full h-full max-w-6xl max-h-[90vh] flex rounded-2xl bg-slate-900/80 border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-1/3 max-w-xs h-full flex flex-col border-r border-slate-800">
                <div className="p-4 flex items-center justify-between border-b border-slate-800"><h2 className="font-bold text-white text-lg">Chat History</h2><button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-700/50"><X size={18}/></button></div>
                <div className="flex-grow p-2 space-y-1 overflow-y-auto">
                    <button onClick={handleNewSession} className="w-full flex items-center gap-2 p-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500"><Plus size={16}/> New Chat</button>
                    {sessions.map(session => (<button key={session.session_id} onClick={() => setSelectedSessionId(session.session_id)} className={`w-full p-3 rounded-xl text-left text-sm ${selectedSessionId === session.session_id ? 'bg-slate-700/80' : 'hover:bg-slate-800/50'}`}><p className="font-medium text-slate-200 truncate">{session.title}</p><p className="text-xs text-slate-500 mt-1">{new Date(session.last_updated).toLocaleDateString()}</p></button>))}
                </div>
            </div>
            <div className="w-2/3 h-full flex flex-col bg-slate-800/30">
                {messages.length === 0 && !selectedSessionId && !loading ? ( 
                  <AIInput onSend={sendMessage} /> 
                ) : messages.length === 0 && loading ? (
                  <div className="flex-grow flex items-center justify-center">
                    <ChatLoader size={150} text="Analyzing document" />
                  </div>
                ) : (
                  <>
                    <div ref={scrollAreaRef} className="flex-grow p-6 flex flex-col overflow-y-auto"><div className="mt-auto space-y-6"><AnimatePresence>{messages.map((msg, i) => <ChatMessage key={i} role={msg.role} text={msg.text} />)}</AnimatePresence>{loading && <div className="p-4 flex justify-center"><ChatLoader size={80} text="Thinking" /></div>}</div></div>
                    <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                        <div className="relative">
                            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}} rows={2} className="w-full pl-4 pr-14 py-3 bg-slate-800 border border-slate-700 rounded-xl resize-none text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ask a follow-up question..." />
                            <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed">{loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5" />}</button>
                        </div>
                    </div>
                  </>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LegalAssistant({ uid }: { uid: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <button
                className="floating-ai-button fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                onClick={() => setIsModalOpen(true)}
                style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.9) 0%, rgba(99,102,241,0.9) 100%)',
                    boxShadow: '0 0 20px rgba(59,130,246, 0.6), 0 0 40px rgba(99,102,241, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                }}
                aria-label="Open AI Assistant"
            >
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
                <div className="relative z-10 text-white"><Bot size={32} /></div>
                <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-blue-400"></div>
            </button>
            <ChatModal uid={uid} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}

// Add empty mock implementations for API functions to avoid errors
// const getSessions = async () => ({ sessions: [] as any[] });
// const getSessionHistory = async (sessionId: string) => ({ history: [] as any[] });
// const chatWithAssistant = async (uid: string, question: string, sessionId?: string) => ({ answer: '', session_id: '' });

