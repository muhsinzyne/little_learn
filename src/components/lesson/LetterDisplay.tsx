"use client";

import React from "react";

interface LetterDisplayProps {
  contentValue: string;
}

export default function LetterDisplay({ contentValue }: LetterDisplayProps) {
  const upper = contentValue.toUpperCase();
  const lower = contentValue.toLowerCase();

  return (
    <div className="w-full max-w-2xl aspect-[16/10] bg-white rounded-[3rem] shadow-2xl border-8 border-ll-purple/10 flex items-center justify-center gap-12 sm:gap-24 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-ll-purple/5 to-transparent pointer-events-none" />
      
      <div className="flex flex-col items-center animate-in zoom-in-50 duration-500">
        <span className="text-[10rem] sm:text-[14rem] font-black text-ll-purple leading-none drop-shadow-sm">
          {upper}
        </span>
        <span className="text-xl font-bold text-slate-400 mt-4 tracking-widest uppercase">Capital</span>
      </div>

      <div className="w-2 h-40 bg-slate-100 rounded-full hidden sm:block" />

      <div className="flex flex-col items-center animate-in zoom-in-50 duration-700">
        <span className="text-[10rem] sm:text-[14rem] font-black text-ll-purple leading-none drop-shadow-sm">
          {lower}
        </span>
        <span className="text-xl font-bold text-slate-400 mt-4 tracking-widest uppercase">Small</span>
      </div>
    </div>
  );
}
