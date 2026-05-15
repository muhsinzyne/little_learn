"use client";

import React from "react";
import { avatars } from "@/components/avatars/avatars";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ChildProfile {
  id: number;
  name: string;
  avatarKey: string | null;
}

interface ChildSwitcherProps {
  profiles: ChildProfile[];
  activeId: number | null;
  onAddClick: () => void;
}

export default function ChildSwitcher({ profiles, activeId, onAddClick }: ChildSwitcherProps) {
  const router = useRouter();
  const { update } = useSession();

  const handleSwitch = async (id: number) => {
    if (id === activeId) return;

    try {
      const res = await fetch("/api/child-profile/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childProfileId: id }),
      });

      if (res.ok) {
        await update({ activeChildProfileId: id });
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to switch profile", err);
    }
  };

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
      {profiles.map((profile) => {
        const AvatarIcon = profile.avatarKey ? avatars[profile.avatarKey] : null;
        const isActive = profile.id === activeId;

        return (
          <button
            key={profile.id}
            onClick={() => handleSwitch(profile.id)}
            className={`flex items-center gap-3 px-5 py-3 rounded-full transition-all flex-shrink-0 ${
              isActive
                ? "bg-ll-purple text-white shadow-lg ring-4 ring-ll-purple-light scale-105"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl overflow-hidden ${isActive ? "bg-white/20" : "bg-slate-100"}`}>
              {AvatarIcon ? <AvatarIcon className="w-full h-full" /> : <span className="flex items-center justify-center h-full">👤</span>}
            </div>
            <span className="font-black text-sm tracking-wide">{profile.name}</span>
          </button>
        );
      })}

      <button
        onClick={onAddClick}
        className="flex items-center gap-3 px-5 py-3 bg-white text-ll-purple border-2 border-dashed border-ll-purple-light/50 hover:border-ll-purple hover:bg-ll-purple-light/5 rounded-full transition-all flex-shrink-0"
      >
        <div className="w-10 h-10 rounded-xl bg-ll-purple-light/20 flex items-center justify-center text-xl font-bold">
          +
        </div>
        <span className="font-black text-sm tracking-wide">Add Child</span>
      </button>
    </div>
  );
}
