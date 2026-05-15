"use client";

import React from "react";

interface QuestionPromptProps {
  type: "LETTER" | "NUMBER" | "WORD" | "SHAPE" | "COLOR";
  value: string;
  imageKey?: string | null;
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

const ShapeSvg = ({ shape }: { shape: string }) => {
  const baseClass = "w-32 h-32 fill-ll-green stroke-ll-green-dark stroke-[8]";
  switch (shape.toLowerCase()) {
    case "circle": return <svg viewBox="0 0 100 100" className={baseClass}><circle cx="50" cy="50" r="40" /></svg>;
    case "square": return <svg viewBox="0 0 100 100" className={baseClass}><rect x="15" y="15" width="70" height="70" rx="8" /></svg>;
    case "triangle": return <svg viewBox="0 0 100 100" className={baseClass}><path d="M50 15 L85 80 L15 80 Z" strokeLinejoin="round" /></svg>;
    case "rectangle": return <svg viewBox="0 0 100 100" className={baseClass}><rect x="10" y="25" width="80" height="50" rx="8" /></svg>;
    case "oval": return <svg viewBox="0 0 100 100" className={baseClass}><ellipse cx="50" cy="50" rx="40" ry="25" /></svg>;
    case "diamond": return <svg viewBox="0 0 100 100" className={baseClass}><path d="M50 10 L85 50 L50 90 L15 50 Z" strokeLinejoin="round" /></svg>;
    case "star": return <svg viewBox="0 0 100 100" className={baseClass}><path d="M50 10 L61 40 L93 40 L67 60 L77 90 L50 72 L23 90 L33 60 L7 40 L39 40 Z" strokeLinejoin="round" /></svg>;
    case "heart": return <svg viewBox="0 0 100 100" className={baseClass}><path d="M50 85 C50 85 10 60 10 35 C10 15 30 10 50 30 C70 10 90 15 90 35 C90 60 50 85 50 85 Z" /></svg>;
    case "pentagon": return <svg viewBox="0 0 100 100" className={baseClass}><path d="M50 10 L90 40 L75 85 L25 85 L10 40 Z" strokeLinejoin="round" /></svg>;
    case "hexagon": return <svg viewBox="0 0 100 100" className={baseClass}><path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" strokeLinejoin="round" /></svg>;
    default: return <div className="text-6xl">❓</div>;
  }
};

export default function QuestionPrompt({ type, value, imageKey }: QuestionPromptProps) {
  const containerClass = "w-full max-w-sm aspect-square bg-white rounded-[3rem] shadow-xl border-4 border-slate-50 flex items-center justify-center p-8 animate-in zoom-in-50 duration-500";

  switch (type) {
    case "LETTER":
      return (
        <div className={containerClass}>
          <span className="text-9xl font-black text-ll-purple drop-shadow-sm">{value.toUpperCase()}</span>
        </div>
      );
    case "NUMBER":
      return (
        <div className={containerClass}>
          <span className="text-9xl font-black text-ll-blue drop-shadow-sm">{value}</span>
        </div>
      );
    case "WORD":
      return (
        <div className={containerClass}>
          {imageKey ? (
            <img src={`/images/words/${imageKey}.png`} alt={value} className="max-h-full object-contain" />
          ) : (
            <span className="text-6xl font-black text-ll-orange capitalize">{value}</span>
          )}
        </div>
      );
    case "SHAPE":
      return (
        <div className={containerClass}>
          <ShapeSvg shape={value} />
        </div>
      );
    case "COLOR":
      return (
        <div className={containerClass}>
          <div className="w-32 h-32 rounded-[2rem] shadow-lg border-4 border-white" style={{ backgroundColor: colorMap[value.toLowerCase()] || "#CBD5E1" }} />
        </div>
      );
    default:
      return null;
  }
}
