"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ChildSwitcher from "@/components/child/ChildSwitcher";
import AddChildModal from "@/components/child/AddChildModal";
import ProgressSummaryStrip from "@/components/dashboard/ProgressSummaryStrip";
import StageCard from "@/components/dashboard/StageCard";
import { useLayout } from "@/components/providers/LayoutProvider";

interface DashboardData {
  activeChild: {
    id: number;
    name: string;
    avatarKey: string | null;
    totalCompletedLessons: number;
    totalMilestones: number;
  } | null;
  stages: {
    id: number;
    title: string;
    iconKey: string | null;
    totalLessons: number;
    completedLessons: number;
    isCompleted: boolean;
    hasMilestone: boolean;
    milestoneFlag: boolean;
  }[];
}

interface Profile {
  id: number;
  name: string;
  avatarKey: string | null;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { mode } = useLayout();
  const [data, setData] = useState<DashboardData | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [dashRes, profRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/child-profile"),
      ]);

      if (dashRes.ok && profRes.ok) {
        const [dashData, profData] = await Promise.all([
          dashRes.json(),
          profRes.json(),
        ]);
        setData(dashData);
        setProfiles(profData);
      }
    } catch {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-16 h-16 border-4 border-ll-purple border-t-transparent rounded-full animate-spin" />
        <p className="font-black text-slate-400 uppercase tracking-widest animate-pulse">
          Loading adventure...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header / Switcher Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className={mode === "wide" ? "text-center md:text-left" : ""}>
            <h1 className={`font-black text-slate-800 tracking-tight transition-all duration-500 ${
              mode === "wide" ? "text-6xl" : "text-4xl"
            }`}>
              {data?.activeChild 
                ? `Adventure time, ${data.activeChild.name}!` 
                : "Choose a student!"}
            </h1>
            <p className={`text-slate-400 font-bold mt-2 ${mode === "wide" ? "text-2xl" : "text-lg"}`}>
              What would you like to learn today?
            </p>
          </div>
        </div>

        <ChildSwitcher 
          profiles={profiles} 
          activeId={session?.user?.activeChildProfileId || null}
          onAddClick={() => setShowAddModal(true)}
        />
      </section>

      {/* Progress Strip */}
      {data?.activeChild && (
        <ProgressSummaryStrip 
          completedLessons={data.activeChild.totalCompletedLessons}
          starsEarned={data.activeChild.totalCompletedLessons} // 1 star = 1 lesson
          milestones={data.activeChild.totalMilestones}
          mode={mode}
        />
      )}

      {/* Stage Grid */}
      <section className="space-y-6">
        <div className={`flex items-center justify-between mb-2 ${mode === "wide" ? "px-4" : ""}`}>
          <h2 className={`font-black text-slate-700 ${mode === "wide" ? "text-3xl" : "text-2xl"}`}>
            Learning Stages
          </h2>
          <div className="h-1 flex-1 mx-6 bg-slate-100 rounded-full hidden sm:block" />
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {data?.stages.length || 0} Stages Available
          </span>
        </div>

        <div className={`grid gap-6 transition-all duration-500 ${
          mode === "mobile" 
            ? "grid-cols-1" 
            : mode === "laptop" 
            ? "grid-cols-2" 
            : "grid-cols-3 lg:grid-cols-4"
        }`}>
          {data?.stages?.map((stage) => (
            <StageCard 
              key={stage.id} 
              {...stage} 
              mode={mode}
            />
          ))}
        </div>
      </section>

      {showAddModal && (
        <AddChildModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
            setShowAddModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
