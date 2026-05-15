"use client";

import React from "react";

interface WordDisplayProps {
  contentValue: string;
  contentImageKey?: string | null;
}

export default function WordDisplay({ contentValue, contentImageKey }: WordDisplayProps) {
  const initial = contentValue.charAt(0).toUpperCase();

  return (
    <div className="w-full max-w-2xl aspect-[16/10] bg-white rounded-[3rem] shadow-2xl border-8 border-ll-orange/10 flex flex-col items-center justify-center overflow-hidden relative p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-ll-orange/5 to-transparent pointer-events-none" />
      
      <div className="flex-1 flex items-center justify-center w-full mb-6">
        {contentImageKey ? (
          <img 
            src={`/images/words/${contentImageKey}.png`} 
            alt={contentValue}
            className="max-h-full max-w-full object-contain animate-in zoom-in-50 duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-48 h-48 bg-ll-orange/10 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-500">
            <span className="text-8xl font-black text-ll-orange">{initial}</span>
          </div>
        )}
      </div>

      <div className="animate-in slide-in-from-bottom-8 duration-700">
        <h2 className="text-6xl sm:text-8xl font-black text-ll-orange tracking-tight capitalize drop-shadow-sm">
          {contentValue}
        </h2>
      </div>
    </div>
  );
}
