"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Database } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  dbLogs?: string[];
  dbData?: any[];
}

export default function AgentChat({ contextSummary }: { contextSummary: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello Admin. I am Mersal, your autonomous SQL agent. How can I assist you with Neon DB today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useSettings();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!settings.openRouterKey || !settings.neonDbUrl) {
      setMessages(prev => [...prev, { role: "system", content: "ERROR: OpenRouter API Key or Neon DB URL is missing in Settings." }]);
      return;
    }

    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          settings,
          contextSummary
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to communicate with agent.");
      }

      const data = await res.json();
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.reply,
        dbLogs: data.dbLogs,
        dbData: data.dbData
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "system", content: `ERROR: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="brutal-glass" style={{ display: "flex", flexDirection: "column", height: "600px", padding: "0" }}>
      {/* Header */}
      <div style={{ padding: "15px 20px", borderBottom: "3px solid #000", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", gap: "10px" }}>
        <Bot size={24} />
        <h2 style={{ fontSize: "1.2rem", margin: 0 }}>MERSAL TERMINAL</h2>
        {contextSummary && (
          <span style={{ marginLeft: "auto", fontSize: "0.8rem", background: "#000", padding: "4px 8px", border: "1px solid #fff" }}>
            CONTEXT ACTIVE
          </span>
        )}
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: "flex",
            flexDirection: msg.role === "user" ? "row-reverse" : "row",
            gap: "10px",
            alignItems: "flex-start"
          }}>
            <div style={{
              width: "40px", height: "40px",
              background: msg.role === "user" ? "var(--secondary)" : msg.role === "system" ? "#00ff41" : "#000",
              color: msg.role === "user" || msg.role === "system" ? "#000" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid #000",
              boxShadow: "2px 2px 0px #000",
              flexShrink: 0
            }}>
              {msg.role === "user" ? <User size={20} /> : msg.role === "system" ? <Database size={20} /> : <Bot size={20} />}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "80%" }}>
              <div style={{
                background: msg.role === "user" ? "var(--bg-color)" : "var(--glass-bg)",
                border: "2px solid #000",
                padding: "12px 16px",
                boxShadow: "3px 3px 0px #000",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word"
              }}>
                {msg.content}
              </div>
              
              {/* DB Logs Tab */}
              {msg.dbLogs && msg.dbLogs.length > 0 && (
                <div style={{ background: "#000", color: "#00ff41", border: "2px solid #000", boxShadow: "3px 3px 0px #000", padding: "10px", fontFamily: "monospace", fontSize: "0.85rem" }}>
                  <div style={{ borderBottom: "1px solid #333", paddingBottom: "5px", marginBottom: "8px", fontWeight: "bold" }}>SQL EXECUTION LOGS</div>
                  {msg.dbLogs.map((log, i) => (
                    <div key={i} style={{ marginBottom: "5px" }}>&gt; {log}</div>
                  ))}
                </div>
              )}

              {/* DB Data Tab */}
              {msg.dbData && msg.dbData.length > 0 && (
                <div style={{ background: "var(--glass-bg)", border: "2px solid #00ff41", boxShadow: "3px 3px 0px #000", padding: "10px", fontSize: "0.85rem", overflowX: "auto" }}>
                  <div style={{ borderBottom: "1px solid #00ff41", paddingBottom: "5px", marginBottom: "8px", fontWeight: "bold", color: "#00ff41" }}>DATA OUTPUT</div>
                  {msg.dbData.map((dataObj, i) => (
                    <div key={i} style={{ marginBottom: "10px" }}>
                      {dataObj.status && <div style={{ color: "#00e5ff" }}>{dataObj.status}</div>}
                      {dataObj.error && <div style={{ color: "#ff3366" }}>ERROR: {dataObj.error}</div>}
                      {dataObj.rows && dataObj.rows.length > 0 && (
                        <pre style={{ background: "rgba(0,0,0,0.5)", padding: "10px", margin: "5px 0", color: "#fff", borderLeft: "2px solid #00ff41" }}>
                          {JSON.stringify(dataObj.rows, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ width: "40px", height: "40px", background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #000" }}>
              <Bot size={20} />
            </div>
            <div style={{ padding: "12px 16px", background: "var(--glass-bg)", border: "2px solid #000", fontWeight: "bold" }}>
              PROCESSING...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} style={{ display: "flex", borderTop: "3px solid #000" }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Instruct Mersal to create a table, modify schema, or fetch data..."
          style={{ 
            flex: 1, padding: "15px 20px", fontSize: "1rem", 
            border: "none", outline: "none", background: "transparent",
            color: "var(--text-color)"
          }}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            padding: "0 25px", background: "var(--secondary)", border: "none", 
            borderLeft: "3px solid #000", cursor: "pointer", display: "flex", 
            alignItems: "center", justifyContent: "center", color: "#000",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--primary)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--secondary)"}
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
}
