"use client";

import React, { useState } from "react";
import { Settings, LogOut, Database } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import SettingsModal from "./SettingsModal";
import DirectoryScanner from "./DirectoryScanner";
import AgentChat from "./AgentChat";

export default function Dashboard() {
  const { logout, settings } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [contextSummary, setContextSummary] = useState("");

  const handleScanComplete = (summary: string) => {
    setContextSummary(summary);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navbar */}
      <header style={{ 
        padding: "15px 30px", 
        borderBottom: "3px solid #000",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "var(--glass-bg)",
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ 
            background: "var(--primary)", 
            color: "#fff", 
            padding: "8px", 
            border: "2px solid #000",
            boxShadow: "2px 2px 0px #000"
          }}>
            <Database size={24} />
          </div>
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>MERSAL</h1>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <button 
            className="brutal-button secondary" 
            style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: "8px" }}
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings size={18} /> SETTINGS
          </button>
          <button 
            className="brutal-button" 
            style={{ padding: "8px 16px", background: "#00ff41", color: "#000", display: "flex", alignItems: "center", gap: "8px" }}
            onClick={logout}
          >
            <LogOut size={18} /> LOGOUT
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "30px", maxWidth: "1400px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "350px 1fr", gap: "30px" }}>
        {/* Sidebar */}
        <div>
          <DirectoryScanner onScanComplete={handleScanComplete} />
          
          <div className="brutal-glass" style={{ padding: "20px" }}>
            <h3 style={{ marginBottom: "15px", borderBottom: "2px solid #000", paddingBottom: "10px" }}>STATUS</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>OpenRouter API:</strong>
                <span style={{ color: settings.openRouterKey ? "green" : "red", fontWeight: "bold" }}>
                  {settings.openRouterKey ? "CONFIGURED" : "MISSING"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Neon DB:</strong>
                <span style={{ color: settings.neonDbUrl ? "green" : "red", fontWeight: "bold" }}>
                  {settings.neonDbUrl ? "CONFIGURED" : "MISSING"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Model:</strong>
                <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "150px" }}>
                  {settings.modelName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div>
          <AgentChat contextSummary={contextSummary} />
        </div>
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
