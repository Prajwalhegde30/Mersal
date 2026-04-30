"use client";

import React, { useState, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import { X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px"
    }}>
      <div className="brutal-glass" style={{ width: "100%", maxWidth: "500px", padding: "30px", position: "relative" }}>
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "20px", right: "20px", background: "transparent", border: "none", cursor: "pointer", color: "inherit" }}
        >
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: "20px" }}>SETTINGS</h2>
        
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>OPENROUTER API KEY</label>
            <input 
              type="password" 
              className="brutal-input" 
              value={localSettings.openRouterKey}
              onChange={(e) => setLocalSettings({...localSettings, openRouterKey: e.target.value})}
              placeholder="sk-or-v1-..."
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>MODEL NAME</label>
            <input 
              type="text" 
              className="brutal-input" 
              value={localSettings.modelName}
              onChange={(e) => setLocalSettings({...localSettings, modelName: e.target.value})}
              placeholder="meta-llama/llama-3-8b-instruct"
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>NEON DB URL</label>
            <input 
              type="password" 
              className="brutal-input" 
              value={localSettings.neonDbUrl}
              onChange={(e) => setLocalSettings({...localSettings, neonDbUrl: e.target.value})}
              placeholder="postgresql://user:password@endpoint.neon.tech/dbname"
            />
          </div>
          <button type="submit" className="brutal-button" style={{ marginTop: "15px" }}>
            SAVE CONFIGURATION
          </button>
        </form>
      </div>
    </div>
  );
}
