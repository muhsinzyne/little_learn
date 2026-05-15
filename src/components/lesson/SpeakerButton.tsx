"use client";

import React from "react";

interface SpeakerButtonProps {
  onSpeak: () => void;
  isSpeaking: boolean;
  size?: "sm" | "md" | "lg";
}

export default function SpeakerButton({ onSpeak, isSpeaking, size = "lg" }: SpeakerButtonProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-xl",
    md: "w-20 h-20 text-3xl",
    lg: "w-32 h-32 text-5xl",
  };

  return (
    <div className="relative inline-block">
      {isSpeaking && <div className="speaker-pulse-ring" />}
      <button
        onClick={onSpeak}
        className={`${sizeClasses[size]} bg-ll-purple text-white rounded-full shadow-xl hover:shadow-ll-purple/30 transition-all active:scale-95 flex items-center justify-center z-10 relative`}
        title={isSpeaking ? "Stop" : "Listen"}
      >
        {isSpeaking ? (
          <span className="animate-pulse">🔊</span>
        ) : (
          <span>🔈</span>
        )}
      </button>
    </div>
  );
}
