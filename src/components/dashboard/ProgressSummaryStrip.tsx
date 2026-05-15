"use client";

import React from "react";

interface ProgressSummaryStripProps {
  completedLessons: number;
  starsEarned: number;
  milestones: number;
  mode: string;
}

export default function ProgressSummaryStrip({ 
  completedLessons, 
  starsEarned, 
  milestones,
  mode
}: ProgressSummaryStripProps) {
  const items = [
    { label: "Lessons", value: completedLessons, icon: "📚", color: "bg-ll-blue-light/20 text-ll-blue" },
    { label: "Stars", value: starsEarned, icon: "⭐", color: "bg-ll-yellow-light/40 text-ll-orange" },
    { label: "Milestones", value: milestones, icon: "🏆", color: "bg-ll-pink-light/20 text-ll-pink" },
  ];

  return (
    <div className={`flex flex-wrap gap-4 transition-all ${mode === "wide" ? "justify-center" : ""}`}>
      {items.map((item) => (
        <div 
          key={item.label}
          className={`flex items-center gap-3 px-6 py-4 bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 min-w-[140px] ${
            mode === "wide" ? "max-w-[300px]" : ""
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${item.color}`}>
            {item.icon}
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-none">{item.value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
