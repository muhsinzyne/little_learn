"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLayout } from "@/components/providers/LayoutProvider";

export default function FullscreenWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { mode } = useLayout();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Attempt to enter native fullscreen if supported
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log("Fullscreen request failed or unsupported:", err.message);
      });
    }

    // Listen for custom exit confirm request
    const handleExitRequest = () => setShowConfirm(true);
    window.addEventListener("request-exit-confirm", handleExitRequest);

    return () => {
      window.removeEventListener("request-exit-confirm", handleExitRequest);
    };
  }, []);

  const handleExitClick = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }
    
    // Confirmed exit
    performExit();
  };

  const performExit = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    // Directly exit to dashboard instead of going back through lesson history
    router.push("/dashboard");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 overflow-hidden flex flex-col w-screen h-screen">
      {/* Exit Button & Confirmation Tooltip */}
      <div className="absolute top-4 right-4 z-[110] flex items-center gap-2">
        {showConfirm && (
          <div className="bg-slate-800 text-white p-3 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-right-4 shadow-2xl border border-slate-700">
            <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
              Exit lesson? Progress is saved!
            </span>
            <div className="flex gap-2">
              <button 
                onClick={performExit}
                className="bg-ll-pink text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-ll-pink-dark transition-colors"
              >
                Yes, Exit
              </button>
              <button 
                onClick={() => setShowConfirm(false)}
                className="bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <button 
          onClick={handleExitClick}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all backdrop-blur-md border-2 ${
            showConfirm 
              ? "bg-ll-pink text-white border-ll-pink shadow-lg scale-110" 
              : "bg-black/5 text-slate-400 border-black/5 hover:bg-black/10 hover:text-slate-600"
          }`}
          title="Exit Lesson"
        >
          <span className="text-xl font-black">✕</span>
        </button>
      </div>

      {/* Main Game Content Area */}
      <div className={`flex-1 overflow-y-auto p-4 md:p-10 transition-all duration-500 ${
        mode === "wide" ? "max-w-[1600px] mx-auto w-full" : ""
      }`}>
        <div className={`h-full flex flex-col ${mode === "wide" ? "text-xl" : "text-base"}`}>
          {children}
        </div>
      </div>

      {/* Fallback indicator for non-native fullscreen */}
      <style jsx global>{`
        body {
          overflow: hidden !important;
          height: 100vh !important;
          width: 100vw !important;
        }
      `}</style>
    </div>
  );
}
