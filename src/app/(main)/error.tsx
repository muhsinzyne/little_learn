"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="text-9xl mb-4 animate-bounce-subtle">🩹</div>
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Oops! Something went wrong.</h1>
        <p className="text-xl text-slate-400 font-bold max-w-md mx-auto leading-relaxed">
          Don&apos;t worry! Even best explorers sometimes take a wrong turn. Let&apos;s try again!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => reset()}
          className="bg-ll-purple text-white font-black px-10 py-4 rounded-2xl shadow-xl hover:bg-ll-purple-dark transition-all active:scale-95"
        >
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="bg-slate-100 text-slate-600 font-black px-10 py-4 rounded-2xl shadow-sm hover:bg-slate-200 transition-all active:scale-95"
        >
          Back to Dashboard
        </Link>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="mt-12 p-6 bg-red-50 border border-red-100 rounded-3xl text-left max-w-2xl overflow-auto">
          <p className="text-xs font-mono text-red-500 whitespace-pre-wrap">{error.message}</p>
        </div>
      )}
    </div>
  );
}
