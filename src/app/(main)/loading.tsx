"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
      <div className="relative w-24 h-24">
        {/* Playful animated loader */}
        <div className="absolute inset-0 border-8 border-slate-100 rounded-full" />
        <div className="absolute inset-0 border-8 border-ll-purple rounded-full border-t-transparent animate-spin" />
        <div className="absolute inset-4 bg-ll-purple/10 rounded-full flex items-center justify-center text-3xl animate-bounce-subtle">
          🚀
        </div>
      </div>
      <div className="space-y-2 text-center">
        <p className="text-2xl font-black text-slate-800 tracking-tight">Getting things ready...</p>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em] animate-pulse">
          Your adventure is about to begin!
        </p>
      </div>
    </div>
  );
}
