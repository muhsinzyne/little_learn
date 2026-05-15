"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LessonCardProps {
  id: number;
  title: string;
  type: string;
  contentValue: string;
  isCompleted: boolean;
  mode: string;
}

export default function LessonCard({
  id,
  title,
  type,
  contentValue,
  isCompleted,
  mode
}: LessonCardProps) {
  const router = useRouter();
  // Color mapping based on lesson type
  const colorMap: Record<string, string> = {
    NUMBER: "bg-ll-blue text-white",
    LETTER: "bg-ll-purple text-white",
    WORD: "bg-ll-orange text-white",
    SHAPE: "bg-ll-green text-white",
    COLOR: "bg-ll-pink text-white",
  };

  const bgColor = colorMap[type] || "bg-slate-200 text-slate-700";

  return (
    <div className={`group bg-white rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative flex flex-col ${
      mode === "wide" ? "p-8" : "p-6"
    }`}>
      {/* Type Badge */}
      <div className="absolute top-4 right-4">
        {isCompleted ? (
          <div className="w-8 h-8 bg-ll-yellow rounded-full flex items-center justify-center text-sm shadow-md animate-bounce">
            ⭐
          </div>
        ) : (
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
            {type}
          </div>
        )}
      </div>

      <div className={`aspect-square w-full rounded-2xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-105 ${bgColor}`}>
        <span className={`font-black ${mode === "wide" ? "text-6xl" : "text-4xl"}`}>
          {contentValue}
        </span>
      </div>

      <h3 className="font-black text-slate-800 text-lg mb-4 text-center">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button
          onClick={() => {
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen().catch(() => {});
            }
            router.push(`/lesson/${id}/learn`);
          }}
          className="bg-slate-50 text-slate-600 font-black py-3 rounded-xl text-xs uppercase tracking-wider text-center hover:bg-slate-100 transition-colors border border-slate-200"
        >
          Learn
        </button>
        <button
          onClick={() => {
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen().catch(() => {});
            }
            router.push(`/lesson/${id}/test`);
          }}
          className="bg-ll-purple text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider text-center hover:bg-ll-purple-dark shadow-md hover:shadow-ll-purple/20 transition-all active:scale-95"
        >
          Test
        </button>
      </div>
    </div>
  );
}
