"use client";

import React, { useMemo } from "react";
import Link from "next/link";

interface Stage {
  id: number;
  title: string;
  iconKey: string | null;
  totalLessons: number;
  completedLessons: number;
  isCompleted: boolean;
  hasMilestone: boolean;
  milestoneFlag: boolean;
}

interface StageRoadmapProps {
  stages: Stage[];
  mode: string;
}

export default function StageRoadmap({ stages = [], mode }: StageRoadmapProps) {
  const nodeSize = mode === "mobile" ? 90 : mode === "laptop" ? 120 : 140;
  const rowHeight = mode === "mobile" ? 180 : mode === "laptop" ? 220 : 260;
  
  const activeIndex = useMemo(() => {
    const firstIncomplete = stages.findIndex(s => !s.isCompleted);
    if (firstIncomplete === -1) return stages.length - 1;
    return firstIncomplete;
  }, [stages]);

  // Premium platform color palettes (Top Light, Top Dark, Edge Light, Edge Dark)
  const platformColors = [
    { tl: "#64b5f6", td: "#1e88e5", el: "#1976d2", ed: "#0d47a1" }, // Blue
    { tl: "#ba68c8", td: "#8e24aa", el: "#7b1fa2", ed: "#4a148c" }, // Purple
    { tl: "#f06292", td: "#d81b60", el: "#c2185b", ed: "#880e4f" }, // Pink
    { tl: "#ffb74d", td: "#fb8c00", el: "#f57c00", ed: "#e65100" }, // Orange
    { tl: "#aed581", td: "#7cb342", el: "#689f38", ed: "#33691e" }, // Green
    { tl: "#4dd0e1", td: "#00acc1", el: "#0097a6", ed: "#006064" }, // Teal
    { tl: "#90a4ae", td: "#546e7a", el: "#455a64", ed: "#263238" }, // Blue Grey
    { tl: "#ff8a65", td: "#f4511e", el: "#e64a19", ed: "#bf360c" }, // Deep Orange
  ];

  const scenery = useMemo(() => {
    const elements = [];
    const props = ["🌴", "🌳", "🌲", "🪴", "🍄", "🌺", "🌻", "🌿", "🦜", "🦋"];
    for (let i = 0; i < 40; i++) {
      elements.push({
        type: props[Math.floor(Math.random() * props.length)],
        top: `${Math.random() * 95}%`,
        left: `${Math.random() * 95}%`,
        scale: 0.8 + Math.random() * 1.5,
        rotate: (Math.random() - 0.5) * 30,
        opacity: 0.8 + Math.random() * 0.2,
        zIndex: Math.floor(Math.random() * 10)
      });
    }
    return elements;
  }, []);

  if (!stages.length) return null;

  return (
    <div 
      className="relative w-full py-16 px-4 select-none overflow-hidden rounded-[4rem] border-8 border-[#7cb342] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
      style={{
        backgroundImage: "url('/images/jungle_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "local" // So it scrolls nicely if the container scrolls
      }}
    >
      
      {/* Darken overlay to ensure the path and nodes pop against the bright background */}
      <div className="absolute inset-0 bg-[#1e3a1a]/30 pointer-events-none" />

      {/* Start Sign */}
      <div className="absolute top-10 left-[10%] rotate-[-5deg] z-20">
         <div className="bg-[#8d6e63] border-4 border-[#5d4037] px-4 py-2 rounded-lg shadow-lg">
            <span className="text-white font-black tracking-widest text-xl">START</span>
         </div>
         <div className="w-2 h-8 bg-[#5d4037] mx-auto -mt-1 shadow-md" />
      </div>

      {/* --- LAYER 3: The 3D Road --- */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]" preserveAspectRatio="none">
        <defs>
          <filter id="roadTexture">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0.9 0 0 0  0 0.7 0 0 0  0 0 0 0.2 0" in="noise" result="coloredNoise" />
            <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" />
          </filter>
          <radialGradient id="waypointHighlight">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#ffe0b2" stopOpacity="1"/>
            <stop offset="100%" stopColor="#fb8c00" stopOpacity="1"/>
          </radialGradient>
        </defs>

        {stages.map((_, i) => {
          if (i === stages.length - 1) return null;
          const isLeft = i % 2 === 0;
          const startX = isLeft ? 25 : 75;
          const endX = isLeft ? 75 : 25;
          const startY = i * rowHeight + nodeSize / 2 + 80;
          const endY = (i + 1) * rowHeight + nodeSize / 2 + 80;
          const midY = (startY + endY) / 2;
          const pathD = `M ${startX}% ${startY} C ${startX}% ${midY}, ${endX}% ${midY}, ${endX}% ${endY}`;
          const isCompleted = stages[i].isCompleted && stages[i+1].isCompleted;

          const widthMultiplier = mode === "wide" ? 1.5 : mode === "laptop" ? 1.2 : 1;

          return (
            <React.Fragment key={`path-group-${i}`}>
              {/* Road Depth (Shadow/Edge) */}
              <path d={pathD} stroke="#5d4037" strokeWidth={60 * widthMultiplier} fill="none" strokeLinecap="round" transform="translate(0, 10)" />
              {/* Road Edge Light */}
              <path d={pathD} stroke="#a1887f" strokeWidth={60 * widthMultiplier} fill="none" strokeLinecap="round" />
              {/* Road Surface */}
              <path 
                d={pathD} 
                stroke={isCompleted ? "#ffcc80" : "#d7ccc8"} 
                strokeWidth={50 * widthMultiplier} 
                fill="none" 
                strokeLinecap="round" 
                filter="url(#roadTexture)"
                className="transition-colors duration-1000"
              />
              {/* Inner Track / Footprints */}
              <path 
                d={pathD} 
                stroke={isCompleted ? "#ffa726" : "#bcaaa4"} 
                strokeWidth={10 * widthMultiplier} 
                fill="none" 
                strokeLinecap="round" 
                strokeDasharray="15 30"
                opacity="0.6"
              />

              {/* Waypoints (Stepping Stones) */}
              {[0.2, 0.35, 0.5, 0.65, 0.8].map((t, idx) => {
                const x = startX + (endX - startX) * t;
                const y = startY + (endY - startY) * t;
                return (
                  <g key={`wp-${i}-${idx}`} className="transition-transform hover:scale-110">
                    <circle cx={`${x}%`} cy={y + 3} r={12 * widthMultiplier} fill="#4e342e" opacity="0.6" />
                    <circle cx={`${x}%`} cy={y} r={12 * widthMultiplier} fill="url(#waypointHighlight)" stroke="#5d4037" strokeWidth="2" />
                  </g>
                );
              })}
            </React.Fragment>
          );
        })}
      </svg>

      {/* --- LAYER 4: The Nodes (Platforms) --- */}
      <div className="relative z-10 flex flex-col pt-8">
        {stages.map((stage, i) => {
          const isLeft = i % 2 === 0;
          const isInProgress = i === activeIndex && !stage.isCompleted;
          const pCol = platformColors[i % platformColors.length];
          const isLocked = !stage.isCompleted && !isInProgress;

          return (
            <div 
              key={stage.id} 
              className={`flex w-full mb-10 ${isLeft ? "justify-start pl-[10%]" : "justify-end pr-[10%]"}`}
              style={{ height: rowHeight }}
            >
              <div className="relative flex flex-col items-center group">
                
                {/* 3D Platform Link */}
                <Link
                  href={`/stage/${stage.id}`}
                  className="relative transform transition-all duration-300 hover:-translate-y-4 hover:scale-105 active:translate-y-2 active:scale-95"
                  style={{ width: nodeSize, height: nodeSize + 30 }}
                >
                  
                  {/* Active Character (Lion on Jeep or sitting) */}
                  {i === activeIndex && (
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-bounce drop-shadow-[0_15px_10px_rgba(0,0,0,0.5)]">
                      <div className="relative">
                        {/* A tiny jeep body using CSS */}
                        <div className="w-24 h-12 bg-red-500 rounded-lg absolute bottom-0 -left-6 border-4 border-red-700 shadow-xl">
                          <div className="w-6 h-6 bg-slate-800 rounded-full absolute -bottom-3 left-1 border-2 border-slate-300" />
                          <div className="w-6 h-6 bg-slate-800 rounded-full absolute -bottom-3 right-1 border-2 border-slate-300" />
                        </div>
                        <div className="text-6xl relative z-10 -ml-2 drop-shadow-md">🦁</div>
                      </div>
                    </div>
                  )}

                  {/* Platform Shadow */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/40 rounded-full blur-md translate-y-6 scale-90" />
                  
                  {/* Platform Base (3D Edge) */}
                  <div 
                    className="absolute inset-0 rounded-[40px] shadow-inner mt-4"
                    style={{ 
                      background: `linear-gradient(to bottom, ${pCol.el}, ${pCol.ed})`,
                      borderBottom: `6px solid ${pCol.ed}`,
                      filter: isLocked ? 'grayscale(0.8) brightness(0.6)' : 'none'
                    }}
                  />
                  
                  {/* Platform Top (Surface) */}
                  <div 
                    className={`
                      absolute inset-0 bottom-4 rounded-[40px] flex flex-col items-center justify-center
                      border-t-4 border-white/40 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.2)]
                    `}
                    style={{ 
                      background: `radial-gradient(circle at 50% 20%, ${pCol.tl}, ${pCol.td})`,
                      filter: isLocked ? 'grayscale(0.8) brightness(0.8)' : 'none'
                    }}
                  >
                    {/* Glowing ring for active */}
                    {isInProgress && (
                      <div className="absolute inset-0 rounded-[40px] border-[6px] border-yellow-300 animate-pulse shadow-[0_0_30px_rgba(253,224,71,0.8)]" />
                    )}

                    <span className="text-5xl drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)] mb-2 group-hover:scale-110 transition-transform">
                      {stage.iconKey || "📚"}
                    </span>

                    {/* Stage Number Badge */}
                    <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-gradient-to-b from-white to-slate-200 text-[#5d4037] font-black flex items-center justify-center text-xl shadow-[0_5px_10px_rgba(0,0,0,0.4)] border-4 border-[#8d6e63]">
                      {i + 1}
                    </div>

                    {/* Milestone Flag */}
                    {stage.hasMilestone && (
                      <div className="absolute -right-6 -top-8 text-4xl animate-[wave_2s_ease-in-out_infinite] origin-bottom drop-shadow-xl">
                        🚩
                      </div>
                    )}
                  </div>
                </Link>

                {/* Wooden Sign Label */}
                <div className="mt-4 relative z-20 group-hover:rotate-2 transition-transform">
                  {/* Sign Chains/Ropes */}
                  <div className="absolute -top-3 left-4 w-1 h-4 bg-[#5d4037]" />
                  <div className="absolute -top-3 right-4 w-1 h-4 bg-[#5d4037]" />
                  
                  {/* Sign Board */}
                  <div className="bg-gradient-to-b from-[#d7ccc8] to-[#8d6e63] border-4 border-[#5d4037] px-6 py-2 rounded-xl shadow-[0_10px_15px_rgba(0,0,0,0.5)]">
                    <p className={`font-black text-[#3e2723] tracking-tight leading-none text-shadow-sm ${mode === "wide" ? "text-xl" : "text-lg"}`}>
                      {stage.title}
                    </p>
                    {/* Stars on sign */}
                    <div className="flex justify-center gap-1 mt-1">
                      {Array.from({ length: Math.min(3, stage.totalLessons) }).map((_, sIdx) => (
                        <span key={sIdx} className={`text-xs ${sIdx < stage.completedLessons ? "text-yellow-300 drop-shadow-md" : "text-slate-800/30"}`}>★</span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* --- LAYER 4.5: You Did It Sign --- */}
      {stages.length > 0 && stages.every(s => s.isCompleted) && (
        <div className="relative z-30 mt-8 mb-20 flex flex-col items-center animate-bounce">
          <div className="bg-gradient-to-b from-[#ffca28] to-[#ff8f00] border-8 border-[#5d4037] px-10 py-6 rounded-3xl shadow-[0_20px_30px_rgba(0,0,0,0.5)] rotate-[-3deg] transform hover:scale-105 transition-transform">
            <h3 className="text-white font-black text-4xl uppercase tracking-widest" style={{ textShadow: '0 4px 6px rgba(0,0,0,0.5), 0 -2px 2px rgba(255,255,255,0.8)' }}>
              YOU DID IT!
            </h3>
            <div className="flex justify-center gap-2 mt-2 text-2xl">
              🌟 🎉 🌟
            </div>
          </div>
          {/* Sign posts */}
          <div className="flex gap-16 -mt-4 -z-10">
            <div className="w-6 h-20 bg-[#5d4037] rounded-full shadow-lg" />
            <div className="w-6 h-20 bg-[#5d4037] rounded-full shadow-lg" />
          </div>
        </div>
      )}

      {/* --- LAYER 5: Scenery Props (Front) --- */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {scenery.filter((_, i) => i % 2 !== 0).map((el, i) => (
          <div 
            key={`scenery-front-${i}`}
            className="absolute transition-transform duration-1000 drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)]"
            style={{ 
              top: el.top, left: el.left, 
              fontSize: `${3 * el.scale}rem`,
              transform: `rotate(${el.rotate}deg)`,
              opacity: el.opacity,
              zIndex: 50 + el.zIndex
            }}
          >
            {el.type}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(20deg); }
        }
        .text-shadow-sm {
          text-shadow: 0 1px 2px rgba(255,255,255,0.4);
        }
      `}</style>
    </div>
  );
}
