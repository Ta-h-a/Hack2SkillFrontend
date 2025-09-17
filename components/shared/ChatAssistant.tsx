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
    <div className="fixed bottom-6 right-6 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="bg-blue-600 text-white p-3 rounded-t-lg font-medium">Chat Assistant</div>
      <div className="p-3 h-64 overflow-y-auto bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 p-2 rounded max-w-[80%] ${
            msg.role === "user" ? "bg-blue-100 text-blue-900 ml-auto" : "bg-white text-gray-800"
          }`}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 text-sm italic">Assistant is typing...</div>
        )}
      </div>
      <div className="flex border-t bg-white rounded-b-lg">
        <input
          className="flex-1 p-3 outline-none rounded-bl-lg"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask about your document..."
        />
        <button
          className="p-3 bg-blue-600 text-white rounded-br-lg hover:bg-blue-700 disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
