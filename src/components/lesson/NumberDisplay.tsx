"use client";

import React from "react";
import { numberToWords } from "@/lib/numberToWords";

interface NumberDisplayProps {
  contentValue: string;
}

export default function NumberDisplay({ contentValue }: NumberDisplayProps) {
  const num = parseInt(contentValue, 10);
  const word = numberToWords(num);

  return (
    <div className="w-full max-w-2xl aspect-[16/10] bg-white rounded-[3rem] shadow-2xl border-8 border-ll-blue/10 flex flex-col items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-ll-blue/5 to-transparent pointer-events-none" />
      
      <div className="animate-in slide-in-from-top-12 duration-500">
        <span className="text-[12rem] sm:text-[16rem] font-black text-ll-blue leading-none drop-shadow-lg">
          {num}
        </span>
      </div>

      <div className="mt-4 animate-in slide-in-from-bottom-8 duration-700">
        <span className="text-4xl sm:text-6xl font-black text-slate-700 tracking-tight">
          {word}
        </span>
      </div>
    </div>
  );
}
