"use client";

import React, { createContext, useContext, useState } from "react";
import { useLayoutMode, LayoutMode } from "@/hooks/useLayoutMode";

interface LayoutContextType {
  mode: LayoutMode;
  preference: string;
  setPreference: (pref: string) => Promise<void>;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children, initialPreference }: { children: React.ReactNode, initialPreference: string }) {
  const [preference, setPreferenceState] = useState(initialPreference);
  const mode = useLayoutMode(preference);

  const setPreference = async (newPref: string) => {
    setPreferenceState(newPref);
    try {
      await fetch("/api/settings/layout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layoutPreference: newPref }),
      });
    } catch (error) {
      console.error("Failed to save layout preference", error);
    }
  };

  return (
    <LayoutContext.Provider value={{ mode, preference, setPreference }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
