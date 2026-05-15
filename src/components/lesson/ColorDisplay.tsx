"use client";

import React from "react";

interface ColorDisplayProps {
  contentValue: string;
}

const colorMap: Record<string, string> = {
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#10B981",
  yellow: "#FBBF24",
  orange: "#F97316",
  purple: "#8B5CF6",
  pink: "#EC4899",
  brown: "#78350F",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#6B7280",
  cyan: "#06B6D4",
};

export default function ColorDisplay({ contentValue }: ColorDisplayProps) {
  const colorHex = colorMap[contentValue.toLowerCase()] || "#CBD5E1";

  return (
    <div className="w-full max-w-2xl aspect-[16/10] bg-white rounded-[3rem] shadow-2xl border-8 border-ll-pink/10 flex flex-col items-center justify-center overflow-hidden relative p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-ll-pink/5 to-transparent pointer-events-none" />
      
      <div className="flex-1 flex items-center justify-center w-full mb-6">
        <div 
          className="w-48 h-48 sm:w-64 sm:h-64 rounded-[3rem] shadow-2xl border-8 border-white animate-in zoom-in-50 duration-500"
          style={{ backgroundColor: colorHex }}
        />
      </div>

      <div className="animate-in slide-in-from-bottom-8 duration-700">
        <h2 className="text-5xl sm:text-7xl font-black text-ll-pink tracking-tight capitalize drop-shadow-sm">
          {contentValue}
        </h2>
      </div>
    </div>
  );
}
