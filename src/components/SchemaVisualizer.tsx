"use client";

import React, { useState, useRef, useEffect } from "react";
import { RefreshCw, Database, Code } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

interface Column {
  columnName: string;
  dataType: string;
}

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const MermaidViewer = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    import("mermaid").then((m) => {
      const mermaid = m.default;
      mermaid.initialize({ startOnLoad: false, theme: 'dark' });
      if (ref.current) {
        // use a simple random id for the svg
        const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
        mermaid.render(id, chart).then(({ svg }) => {
          if (ref.current) ref.current.innerHTML = svg;
        }).catch(e => {
          console.error("Mermaid error:", e);
        });
      }
    });
  }, [chart]);

  const controlsStyle = {
    background: "#000",
    color: "#00ff41",
    border: "1px solid #00ff41",
    padding: "5px 10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "12px"
  };

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "400px", border: "2px dashed #333", position: "relative", overflow: "hidden" }}>
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={5}
        centerOnInit={true}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div style={{ position: "absolute", zIndex: 10, top: 10, right: 10, display: "flex", gap: "5px" }}>
              <button onClick={() => zoomIn()} style={controlsStyle}>+</button>
              <button onClick={() => zoomOut()} style={controlsStyle}>-</button>
              <button onClick={() => resetTransform()} style={controlsStyle}>RESET</button>
            </div>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div ref={ref} style={{ cursor: "grab" }} />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default function SchemaVisualizer() {
  const { settings } = useSettings();
  const [schema, setSchema] = useState<Record<string, Column[]> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "mermaid">("cards");

  const fetchSchema = async () => {
    if (!settings.neonDbUrl) {
      setError("Please configure Neon DB URL in settings first.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch schema.");
      }
      
      const data = await res.json();
      setSchema(data.schema);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMermaidChart = () => {
    if (!schema) return "";
    let chart = "erDiagram\n";
    Object.entries(schema).forEach(([tableName, columns]) => {
      chart += `  ${tableName} {\n`;
      columns.forEach(col => {
        // Strip non-alphanumeric chars from dataType so mermaid doesn't fail
        const safeType = col.dataType.replace(/[^a-zA-Z0-9_]/g, '');
        chart += `    ${safeType} ${col.columnName}\n`;
      });
      chart += `  }\n`;
    });
    return chart;
  };

  return (
    <div className="brutal-glass" style={{ display: "flex", flexDirection: "column", height: "600px", padding: "0" }}>
      <div style={{ padding: "15px 20px", borderBottom: "3px solid #000", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Database size={24} />
          <h2 style={{ fontSize: "1.2rem", margin: 0 }}>SCHEMA ERD</h2>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {schema && Object.keys(schema).length > 0 && (
            <button 
              onClick={() => setViewMode(viewMode === "cards" ? "mermaid" : "cards")}
              style={{
                background: "transparent",
                color: "#fff",
                border: "2px solid #fff",
                padding: "5px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <Code size={16} />
              {viewMode === "cards" ? "MERMAID VIEW" : "CARD VIEW"}
            </button>
          )}
          <button 
            onClick={fetchSchema} 
            disabled={isLoading}
            style={{
              background: "#000",
              color: "#fff",
              border: "2px solid #fff",
              padding: "5px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <RefreshCw size={16} className={isLoading ? "spin" : ""} />
            {isLoading ? "LOADING..." : "REFRESH"}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexWrap: "wrap", gap: "20px", alignContent: "flex-start", background: "var(--bg-color)" }}>
        {error && (
          <div style={{ width: "100%", background: "#ff3366", color: "#fff", padding: "10px", border: "2px solid #000", fontWeight: "bold" }}>
            ERROR: {error}
          </div>
        )}
        
        {!schema && !isLoading && !error && (
          <div style={{ width: "100%", textAlign: "center", padding: "40px", color: "#666", fontWeight: "bold" }}>
            Click REFRESH to load the database schema.
          </div>
        )}

        {schema && Object.keys(schema).length === 0 && (
          <div style={{ width: "100%", textAlign: "center", padding: "40px", color: "#666", fontWeight: "bold" }}>
            Database is currently empty.
          </div>
        )}

        {schema && Object.keys(schema).length > 0 && viewMode === "mermaid" && (
          <MermaidViewer chart={generateMermaidChart()} />
        )}

        {schema && Object.keys(schema).length > 0 && viewMode === "cards" && Object.entries(schema).map(([tableName, columns]) => (
          <div key={tableName} style={{ 
            width: "300px", 
            background: "var(--glass-bg)", 
            border: "3px solid #000", 
            boxShadow: "5px 5px 0px #000",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{ 
              background: "#000", 
              color: "#00ff41", 
              padding: "10px", 
              fontWeight: "bold", 
              borderBottom: "3px solid #000",
              textAlign: "center",
              fontSize: "1.1rem"
            }}>
              {tableName.toUpperCase()}
            </div>
            <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
              {columns.map((col, i) => (
                <div key={i} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  borderBottom: "1px dashed #333",
                  paddingBottom: "4px"
                }}>
                  <span style={{ fontWeight: "bold", color: "var(--text-color)" }}>{col.columnName}</span>
                  <span style={{ color: "#666", fontSize: "0.85rem" }}>{col.dataType}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
