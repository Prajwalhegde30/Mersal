"use client";

import React, { useState } from "react";
import { FolderSearch } from "lucide-react";

export default function DirectoryScanner({ onScanComplete }: { onScanComplete: (summary: string) => void }) {
  const [path, setPath] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!path.trim()) {
      setError("Please enter a valid directory path.");
      return;
    }
    
    setIsScanning(true);
    setError("");

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to scan directory");
      }

      const data = await res.json();
      onScanComplete(data.summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="brutal-glass" style={{ padding: "20px", marginBottom: "20px" }}>
      <h3 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
        <FolderSearch size={20} />
        SCAN DIRECTORY
      </h3>
      <p style={{ fontSize: "0.9rem", marginBottom: "15px", opacity: 0.8 }}>
        Scan a local project directory to provide context to the agent.
      </p>

      {error && (
        <div style={{ background: "#00ff41", color: "#000", padding: "8px", marginBottom: "15px", fontSize: "0.9rem", fontWeight: "bold" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleScan} style={{ display: "flex", gap: "10px" }}>
        <input 
          type="text" 
          className="brutal-input" 
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="C:\Projects\my-app"
          style={{ flex: 1 }}
        />
        <button type="submit" className="brutal-button" disabled={isScanning}>
          {isScanning ? "SCANNING..." : "SCAN"}
        </button>
      </form>
    </div>
  );
}
