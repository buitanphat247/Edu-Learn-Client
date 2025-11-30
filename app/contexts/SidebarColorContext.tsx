"use client";

import { createContext, useContext, useState, useEffect } from "react";

type SidebarColorContextType = {
  sidebarColor: string;
  setSidebarColor: (color: string) => void;
};

const SidebarColorContext = createContext<SidebarColorContextType | undefined>(undefined);

export function SidebarColorProvider({ children }: { children: any }) {
  const [sidebarColor, setSidebarColorState] = useState<string>("#2f3542");

  useEffect(() => {
    const saved = localStorage.getItem("sidebarColor");
    if (saved) {
      setSidebarColorState(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarColor", sidebarColor);
  }, [sidebarColor]);

  const setSidebarColor = (color: string) => {
    setSidebarColorState(color);
  };

  return <SidebarColorContext.Provider value={{ sidebarColor, setSidebarColor }}>{children}</SidebarColorContext.Provider>;
}

export function useSidebarColor() {
  const context = useContext(SidebarColorContext);
  if (context === undefined) {
    throw new Error("useSidebarColor must be used within a SidebarColorProvider");
  }
  return context;
}
