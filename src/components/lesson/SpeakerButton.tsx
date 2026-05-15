"use client";

import React from "react";

interface SpeakerButtonProps {
  onSpeak: () => void;
  isSpeaking: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export default function SpeakerButton({ onSpeak, isSpeaking, size = "lg", disabled = false }: SpeakerButtonProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-xl",
    md: "w-20 h-20 text-3xl",
    lg: "w-32 h-32 text-5xl",
  };

  return (
    <div className="relative inline-block">
      {isSpeaking && !disabled && <div className="speaker-pulse-ring" />}
      <button
        onClick={onSpeak}
        disabled={disabled}
        className={`${sizeClasses[size]} rounded-full shadow-xl transition-all relative flex items-center justify-center z-10 ${
          disabled 
            ? "bg-slate-200 text-slate-400 cursor-not-allowed opacity-50 shadow-none" 
            : "bg-ll-purple text-white hover:shadow-ll-purple/30 active:scale-95"
        }`}
        title={disabled ? "Sound disabled" : isSpeaking ? "Stop" : "Listen"}
        aria-label={disabled ? "Sound disabled" : isSpeaking ? "Stop speaking" : "Read aloud"}
      >
        {disabled ? (
          <span>🔇</span>
        ) : isSpeaking ? (
          <span className="animate-pulse">🔊</span>
        ) : (
          <span>🔈</span>
        )}
      </button>
    </div>
  );
}
