"use client";

export const dynamic = "force-dynamic";

import React from "react";
import { useLayout } from "@/components/providers/LayoutProvider";

export default function SettingsPage() {
  const { preference, setPreference, mode } = useLayout();

  const layoutOptions = [
    { 
      id: "auto", 
      title: "Automatic", 
      desc: "Changes based on your screen size", 
      icon: "✨",
      preview: (
        <div className="flex gap-0.5 items-end justify-center h-8">
          <div className="w-1 bg-slate-200 h-4 rounded-t-sm" />
          <div className="w-2 bg-ll-purple h-6 rounded-t-sm" />
          <div className="w-3 bg-slate-200 h-8 rounded-t-sm" />
        </div>
      )
    },
    { 
      id: "mobile", 
      title: "Mobile", 
      desc: "One column and bottom bar", 
      icon: "📱",
      preview: (
        <div className="w-4 h-8 border-2 border-slate-200 rounded-md mx-auto relative">
          <div className="absolute bottom-0.5 left-0.5 right-0.5 h-1 bg-ll-purple rounded-sm" />
        </div>
      )
    },
    { 
      id: "laptop", 
      title: "Laptop", 
      desc: "Sidebar and two columns", 
      icon: "💻",
      preview: (
        <div className="w-10 h-6 border-2 border-slate-200 rounded-sm mx-auto flex">
          <div className="w-2 h-full bg-ll-purple" />
          <div className="flex-1 grid grid-cols-2 gap-0.5 p-0.5">
            <div className="bg-slate-100 rounded-[1px]" />
            <div className="bg-slate-100 rounded-[1px]" />
          </div>
        </div>
      )
    },
    { 
      id: "wide", 
      title: "Wide TV", 
      desc: "Big cards and oversized text", 
      icon: "📺",
      preview: (
        <div className="w-12 h-7 border-2 border-slate-200 rounded-sm mx-auto flex flex-col p-1 gap-1">
          <div className="flex-1 grid grid-cols-3 gap-0.5">
            <div className="bg-ll-purple rounded-[1px]" />
            <div className="bg-ll-purple rounded-[1px]" />
            <div className="bg-ll-purple rounded-[1px]" />
          </div>
        </div>
      )
    },
  ];

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
      <header>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Settings</h1>
        <p className="text-slate-400 font-bold text-lg mt-1">Make LittleLearn just right for you.</p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎨</span>
          <h2 className="text-2xl font-black text-slate-700">Layout Preference</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {layoutOptions.map((opt) => {
            const isSelected = preference === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setPreference(opt.id)}
                className={`flex flex-col p-6 rounded-[2rem] border-4 transition-all text-left group ${
                  isSelected 
                    ? "border-ll-purple bg-ll-purple-light/5 shadow-xl scale-105" 
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                <div className="mb-4">
                  {opt.preview}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{opt.icon}</span>
                  <span className={`font-black uppercase tracking-widest text-xs ${
                    isSelected ? "text-ll-purple" : "text-slate-400"
                  }`}>
                    {opt.title}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 leading-tight">
                  {opt.desc}
                </p>
                
                {isSelected && (
                  <div className="mt-4 text-[10px] font-black text-ll-purple uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-ll-purple rounded-full animate-ping" />
                    Selected
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-ll-blue-light/10 border border-ll-blue-light/20 p-6 rounded-3xl flex items-start gap-4">
          <div className="text-2xl">💡</div>
          <div>
            <p className="text-sm font-bold text-slate-600">
              Current Mode: <span className="text-ll-blue uppercase">{mode}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Your layout automatically adapts to your screen size when &quot;Automatic&quot; is selected.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-700">Other Settings</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">More features coming soon</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-40 grayscale pointer-events-none">
          <div className="space-y-4">
            <h4 className="font-black text-slate-500 uppercase tracking-widest text-xs">Parental Controls</h4>
            <div className="h-10 bg-slate-50 rounded-xl" />
            <div className="h-10 bg-slate-50 rounded-xl" />
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-slate-500 uppercase tracking-widest text-xs">Voice & Speech</h4>
            <div className="h-10 bg-slate-50 rounded-xl" />
            <div className="h-10 bg-slate-50 rounded-xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
