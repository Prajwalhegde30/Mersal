"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Database, Zap, Shield, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <header style={{ 
        padding: "20px 40px", 
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
            color: "#000", 
            padding: "8px", 
            border: "2px solid #000",
            boxShadow: "2px 2px 0px #000"
          }}>
            <Database size={24} />
          </div>
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>MERSAL</h1>
        </div>
        
        <button 
          className="brutal-button" 
          onClick={() => router.push('/login')}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px" }}
        >
          LOGIN TERMINAL <ArrowRight size={18} />
        </button>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
        <div className="brutal-glass" style={{ maxWidth: "800px", padding: "60px 40px", margin: "0 auto", position: "relative" }}>
          
          {/* Decorative element */}
          <div style={{ 
            position: "absolute", top: "-15px", left: "-15px", 
            background: "var(--primary)", width: "30px", height: "30px", 
            border: "3px solid #000", boxShadow: "2px 2px 0px #000" 
          }}></div>

          <h1 style={{ fontSize: "4rem", lineHeight: "1.1", marginBottom: "20px", textShadow: "4px 4px 0px var(--primary)" }}>
            AUTONOMOUS <br/> DATABASE MANAGEMENT
          </h1>
          
          <p style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto 40px auto", fontWeight: 600 }}>
            Mersal is a self-hosted SQL agent. Give it instructions, let it scan your project, and watch it architect your Neon DB autonomously.
          </p>
          
          <button 
            className="brutal-button" 
            onClick={() => router.push('/login')}
            style={{ fontSize: "1.2rem", padding: "15px 30px" }}
          >
            INITIALIZE AGENT
          </button>
        </div>

        {/* Feature Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px", maxWidth: "1000px", marginTop: "60px", width: "100%" }}>
          <div className="brutal-glass" style={{ padding: "30px", textAlign: "left" }}>
            <Zap size={32} color="var(--primary)" style={{ marginBottom: "15px" }} />
            <h3 style={{ marginBottom: "10px", fontSize: "1.3rem" }}>AI-Powered SQL</h3>
            <p>Communicate in natural language. Mersal uses OpenRouter to translate instructions into valid, executed SQL commands.</p>
          </div>
          
          <div className="brutal-glass" style={{ padding: "30px", textAlign: "left" }}>
            <Database size={32} color="var(--primary)" style={{ marginBottom: "15px" }} />
            <h3 style={{ marginBottom: "10px", fontSize: "1.3rem" }}>Context Aware</h3>
            <p>Scan your local project directory. Mersal reads your code to recommend the perfect database schema for your app.</p>
          </div>

          <div className="brutal-glass" style={{ padding: "30px", textAlign: "left" }}>
            <Shield size={32} color="var(--primary)" style={{ marginBottom: "15px" }} />
            <h3 style={{ marginBottom: "10px", fontSize: "1.3rem" }}>Self-Hosted</h3>
            <p>Total privacy. Your DB credentials and API keys never leave your local environment. You are in full control.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: "20px", textAlign: "center", borderTop: "3px solid #000", background: "var(--glass-bg)", fontWeight: "bold" }}>
        MERSAL SQL AGENT &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
