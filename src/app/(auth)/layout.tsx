import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-ll-purple-light via-ll-pink-light to-ll-orange-light p-4">
      {/* Floating Animated Shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/30 rounded-lg rotate-12 blur-lg"></div>
      
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-[3rem] shadow-2xl p-8 md:p-12 border border-white/50 relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-ll-purple rounded-3xl flex items-center justify-center shadow-lg transform rotate-3 mb-4">
            <span className="text-4xl">📚</span>
          </div>
          <h1 className="text-4xl font-extrabold text-ll-purple tracking-tight">LittleLearn</h1>
          <p className="text-slate-400 font-medium">Let&apos;s start the adventure!</p>
        </div>
        {children}
      </div>
    </div>
  );
}
