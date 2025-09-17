import React, { useState } from "react";
import { chatWithAssistant } from "@/lib/api";

interface ChatAssistantProps {
  uid: string;
}

export default function ChatAssistant({ uid }: ChatAssistantProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { role: "user", text: input }]);
    setLoading(true);
    try {
      const res = await chatWithAssistant(uid, input);
      setMessages(msgs => [...msgs, { role: "assistant", text: res.response }]);
    } catch {
      setMessages(msgs => [...msgs, { role: "assistant", text: "Error from assistant." }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border rounded shadow-lg z-50">
      <div className="p-2 border-b font-bold">Chat Assistant</div>
      <div className="p-2 h-48 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : "text-left text-blue-700"}>{msg.text}</div>
        ))}
        {loading && <div className="text-gray-400">Assistant is typing...</div>}
      </div>
      <div className="flex border-t">
        <input
          className="flex-1 p-2 outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask about your document..."
        />
        <button className="p-2 bg-blue-500 text-white" onClick={sendMessage} disabled={loading}>Send</button>
      </div>
    </div>
  );
}
