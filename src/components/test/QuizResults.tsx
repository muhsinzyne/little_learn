"use client";

import React from "react";
import Link from "next/link";

interface QuizResultsProps {
  score: number;
  total: number;
  onTryAgain: () => void;
}

export default function QuizResults({ score, total, onTryAgain }: QuizResultsProps) {
  const isWinner = score >= 7;

  return (
    <div className="flex flex-col items-center gap-10 text-center animate-in zoom-in-95 duration-500">
      <div className="space-y-4">
        <h2 className="text-5xl font-black text-slate-800 tracking-tight">Test Complete!</h2>
        <p className={`text-2xl font-bold ${isWinner ? "text-ll-green" : "text-ll-purple"}`}>
          {isWinner ? "🎉 Amazing job! You're a superstar!" : "💪 Great try! Keep practicing!"}
        </p>
      </div>

      <div className="flex gap-4 justify-center py-6">
        {Array.from({ length: total }).map((_, i) => (
          <div 
            key={i}
            className={`text-5xl opacity-0 animate-star-drop`}
            style={{ animationDelay: `${i * 150}ms` }}
          >
            {i < score ? "⭐" : "⚪"}
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-slate-50 w-full max-w-md space-y-2">
        <div className="text-sm font-black text-slate-400 uppercase tracking-widest">Stars Earned</div>
        <div className="text-7xl font-black text-slate-800">{score} / {total}</div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={onTryAgain}
          className="flex-1 bg-slate-100 text-slate-600 font-black py-5 rounded-[2rem] text-xl hover:bg-slate-200 transition-all active:scale-95"
        >
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="flex-1 bg-ll-purple text-white font-black py-5 rounded-[2rem] text-xl hover:bg-ll-purple-dark shadow-xl hover:shadow-ll-purple/20 transition-all active:scale-95"
        >
          Finish
        </Link>
      </div>
    </div>
  );
}
