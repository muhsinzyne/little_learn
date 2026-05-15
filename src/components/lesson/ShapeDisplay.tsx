"use client";

import React from "react";

interface ShapeDisplayProps {
  contentValue: string;
}

const ShapeSvg = ({ shape }: { shape: string }) => {
  const baseClass = "w-48 h-48 sm:w-64 sm:h-64 drop-shadow-xl animate-in zoom-in-50 duration-500 fill-ll-green stroke-ll-green-dark stroke-[8]";

  switch (shape.toLowerCase()) {
    case "circle":
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <circle cx="50" cy="50" r="40" />
        </svg>
      );
    case "square":
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <rect x="15" y="15" width="70" height="70" rx="8" />
        </svg>
      );
    case "triangle":
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <path d="M50 15 L85 80 L15 80 Z" strokeLinejoin="round" />
        </svg>
      );
    case "rectangle":
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <rect x="10" y="25" width="80" height="50" rx="8" />
        </svg>
      );
    case "oval":
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <ellipse cx="50" cy="50" rx="40" ry="25" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <path d="M50 10 L85 50 L50 90 L15 50 Z" strokeLinejoin="round" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <path d="M50 10 L61 40 L93 40 L67 60 L77 90 L50 72 L23 90 L33 60 L7 40 L39 40 Z" strokeLinejoin="round" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <path d="M50 85 C50 85 10 60 10 35 C10 15 30 10 50 30 C70 10 90 15 90 35 C90 60 50 85 50 85 Z" />
        </svg>
      );
    case "pentagon":
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <path d="M50 10 L90 40 L75 85 L25 85 L10 40 Z" strokeLinejoin="round" />
        </svg>
      );
    case "hexagon":
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" strokeLinejoin="round" />
        </svg>
      );
    default:
      return <div className="text-8xl">❓</div>;
  }
};

export default function ShapeDisplay({ contentValue }: ShapeDisplayProps) {
  return (
    <div className="w-full max-w-2xl aspect-[16/10] bg-white rounded-[3rem] shadow-2xl border-8 border-ll-green/10 flex flex-col items-center justify-center overflow-hidden relative p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-ll-green/5 to-transparent pointer-events-none" />
      
      <div className="flex-1 flex items-center justify-center w-full mb-4">
        <ShapeSvg shape={contentValue} />
      </div>

      <div className="animate-in slide-in-from-bottom-8 duration-700">
        <h2 className="text-5xl sm:text-7xl font-black text-ll-green tracking-tight capitalize">
          {contentValue}
        </h2>
      </div>
    </div>
  );
}
