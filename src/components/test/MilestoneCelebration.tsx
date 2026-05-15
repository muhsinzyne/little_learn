"use client";

import React from "react";
import Link from "next/link";

interface MilestoneCelebrationProps {
  stageName: string;
}

export default function MilestoneCelebration({ stageName }: MilestoneCelebrationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md p-6 animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-8 max-w-xl text-center">
        <div className="relative">
          <div className="text-[12rem] animate-confetti">🏆</div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i}
                className="absolute text-2xl animate-confetti opacity-0"
                style={{ 
                  transform: `rotate(${i * 30}deg) translateY(-150px)`,
                  animationDelay: `${i * 100}ms`
                }}
              >
                ✨
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-6xl font-black text-slate-800 tracking-tight">Stage Complete!</h2>
          <p className="text-2xl font-bold text-ll-green uppercase tracking-wide">
            {stageName}
          </p>
          <p className="text-slate-400 font-bold max-w-xs mx-auto">
            You&apos;ve learned everything in this stage! You&apos;re doing amazing!
          </p>
        </div>

        <Link
          href="/dashboard"
          className="bg-ll-green text-white font-black px-12 py-5 rounded-[2rem] text-2xl shadow-xl hover:bg-ll-green-dark hover:shadow-ll-green/20 transition-all active:scale-95"
        >
          Keep Learning!
        </Link>
      </div>
    </div>
  );
}
