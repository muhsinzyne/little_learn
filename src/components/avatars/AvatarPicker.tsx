"use client";

import React from "react";
import { avatars } from "./avatars";

interface AvatarPickerProps {
  selectedKey: string;
  onSelect: (key: string) => void;
}

export default function AvatarPicker({ selectedKey, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(avatars).map(([key, AvatarIcon]) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(key)}
          className={`relative aspect-square rounded-2xl p-2 transition-all duration-300 ${
            selectedKey === key
              ? "bg-ll-purple-light ring-4 ring-ll-purple scale-110 z-10 shadow-lg"
              : "bg-slate-50 hover:bg-slate-100 hover:scale-105"
          }`}
        >
          <AvatarIcon className="w-full h-full" />
          {selectedKey === key && (
            <div className="absolute -top-2 -right-2 bg-ll-green text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-bounce">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
