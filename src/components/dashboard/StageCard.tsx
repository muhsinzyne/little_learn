"use client";

import React from "react";
import Link from "next/link";

interface StageCardProps {
  id: number;
  title: string;
  iconKey: string | null;
  totalLessons: number;
  completedLessons: number;
  isCompleted: boolean;
  hasMilestone: boolean;
  milestoneFlag: boolean;
  mode: string;
}

export default function StageCard({
  id,
  title,
  iconKey,
  totalLessons,
  completedLessons,
  isCompleted,
  milestoneFlag,
  mode
}: StageCardProps) {
  // Logic for stars display
  const starsToDisplay = totalLessons <= 12 ? totalLessons : 0;

  return (
    <Link 
      href={`/stage/${id}`}
      className={`group bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative ${
        mode === "wide" ? "p-8" : "p-6"
      }`}
    >
      {/* Background Icon */}
      <div className="absolute -right-4 -top-4 text-8xl opacity-[0.03] group-hover:opacity-10 transition-opacity transform -rotate-12 group-hover:rotate-0 duration-500">
        {iconKey || "📚"}
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className={`w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform`}>
          {iconKey || "📚"}
        </div>
        
        {isCompleted && milestoneFlag && (
          <div className="w-10 h-10 bg-ll-yellow rounded-full flex items-center justify-center text-xl shadow-lg animate-pulse">
            🏆
          </div>
        )}
      </div>

      <h3 className={`font-black text-slate-800 leading-tight mb-3 ${mode === "wide" ? "text-2xl" : "text-xl"}`}>
        {title}
      </h3>

      <div className="space-y-4">
        {/* Star Progress */}
        <div className="flex flex-wrap gap-1">
          {starsToDisplay > 0 ? (
            Array.from({ length: totalLessons }).map((_, i) => (
              <span 
                key={i} 
                className={`text-sm ${i < completedLessons ? "text-ll-yellow drop-shadow-sm" : "text-slate-100"}`}
              >
                ⭐
              </span>
            ))
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
              <span className="text-ll-yellow">⭐</span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                {completedLessons} / {totalLessons}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Progress</span>
            <span>{Math.round((completedLessons / totalLessons) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                isCompleted ? "bg-ll-green" : "bg-ll-blue"
              }`}
              style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Completion Indicator */}
      {isCompleted && (
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 text-ll-green">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs font-black uppercase tracking-widest">Completed!</span>
        </div>
      )}
    </Link>
  );
}
