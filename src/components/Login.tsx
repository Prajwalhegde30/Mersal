"use client";

import React, { useState } from "react";
import { useSettings } from "@/context/SettingsContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useSettings();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      const success = login(password);
      if (!success) {
        setError("Invalid credentials");
      }
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div className="brutal-glass" style={{ padding: "40px", maxWidth: "400px", width: "100%" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", textAlign: "center" }}>MERSAL</h1>
        <p style={{ textAlign: "center", marginBottom: "30px", fontWeight: 600 }}>AUTONOMOUS SQL AGENT</p>

        {error && (
          <div style={{ background: "#00ff41", color: "#000", padding: "10px", marginBottom: "20px", fontWeight: "bold", border: "3px solid #000", boxShadow: "3px 3px 0px #000" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>USERNAME</label>
            <input
              type="text"
              className="brutal-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="********"
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>PASSWORD</label>
            <input
              type="password"
              className="brutal-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <button type="submit" className="brutal-button" style={{ marginTop: "10px", width: "100%" }}>
            INITIALIZE
          </button>
        </form>
      </div>
    </div>
  );
}
