"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Settings {
  openRouterKey: string;
  modelName: string;
  neonDbUrl: string;
}

interface SettingsContextType {
  isAuthenticated: boolean;
  login: (pass: string) => boolean;
  logout: () => void;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  openRouterKey: "",
  modelName: "meta-llama/llama-3-8b-instruct",
  neonDbUrl: "",
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("mersal_auth");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }
      
      const savedSettings = localStorage.getItem("mersal_settings");
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      }
    } catch (e) {
      console.error("Failed to load settings from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const login = (pass: string) => {
    // Admin login with simple hardcoded 'admin' password
    if (pass === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("mersal_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("mersal_auth");
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("mersal_settings", JSON.stringify(updated));
      return updated;
    });
  };

  if (!isLoaded) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Mersal...</div>;

  return (
    <SettingsContext.Provider value={{ isAuthenticated, login, logout, settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
