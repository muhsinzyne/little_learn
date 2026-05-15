"use client";

import React from "react";
import { useLayout } from "@/components/providers/LayoutProvider";
import Link from "next/link";

export default function ResponsiveContent({ 
  children, 
  firstName 
}: { 
  children: React.ReactNode;
  firstName: string;
}) {
  const { mode } = useLayout();

  return (
    <main className={`flex-1 flex flex-col min-h-0 overflow-hidden relative transition-all duration-500 ${
      mode === "mobile" ? "pb-20" : ""
    }`}>
      {/* Header */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 md:px-8 flex-shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-ll-yellow rounded-full flex items-center justify-center text-xl shadow-sm border-2 border-white animate-bounce">
            👋
          </div>
          <div className={`${mode === "mobile" ? "block" : "hidden sm:block"}`}>
            <h2 className={`font-black text-slate-800 leading-tight ${mode === "wide" ? "text-2xl" : "text-lg"}`}>
              Hi, {firstName}!
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Parent Account
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Active Student
            </p>
            <div className="h-1 w-full bg-ll-green rounded-full mt-1 shadow-sm" />
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/settings"
              className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-ll-purple transition-all"
            >
              <span className="text-xl">⚙️</span>
            </Link>
            
            <div className={`rounded-2xl bg-ll-blue-light border-2 border-white shadow-md overflow-hidden transition-all ${
              mode === "wide" ? "w-16 h-16" : "w-12 h-12"
            }`}>
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-2xl">
                👤
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className={`flex-1 overflow-y-auto p-6 md:p-10 transition-all duration-500 ${
        mode === "wide" ? "max-w-[1400px] mx-auto w-full" : ""
      }`}>
        <div className={mode === "wide" ? "text-xl" : "text-base"}>
          {children}
        </div>
      </div>
    </main>
  );
}
