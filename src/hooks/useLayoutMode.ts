"use client";

import { useState, useEffect, useCallback } from "react";

export type LayoutMode = "mobile" | "laptop" | "wide";

export function useLayoutMode(preference: string = "auto") {
  const [mode, setMode] = useState<LayoutMode>("laptop");

  const calculateMode = useCallback(() => {
    if (preference !== "auto" && ["mobile", "laptop", "wide"].includes(preference)) {
      return preference as LayoutMode;
    }

    const width = window.innerWidth;
    if (width < 768) return "mobile";
    if (width < 1280) return "laptop";
    return "wide";
  }, [preference]);

  useEffect(() => {
    const handleResize = () => {
      setMode(calculateMode());
    };

    setMode(calculateMode());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateMode]);

  return mode;
}
