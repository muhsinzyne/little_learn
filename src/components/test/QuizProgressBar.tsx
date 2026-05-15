"use client";

import React from "react";

interface QuizProgressBarProps {
  current: number;
  total: number;
  results: (boolean | null)[];
}

export default function QuizProgressBar({ current, total, results }: QuizProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-sm font-black text-slate-400 uppercase tracking-widest">
        <span>Question {current} of {total}</span>
        <span className="text-ll-purple">{Math.round(progress)}% Complete</span>
      </div>
      
      <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex p-1">
        <div 
          className="h-full bg-ll-purple rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex gap-2 justify-center">
        {Array.from({ length: total }).map((_, i) => (
          <div 
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              results[i] === true 
                ? "bg-ll-green scale-110 shadow-ll-green/20" 
                : results[i] === false 
                ? "bg-ll-pink scale-110 shadow-ll-pink/20" 
                : i === current - 1
                ? "bg-ll-purple animate-pulse scale-125"
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
