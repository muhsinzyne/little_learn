"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LessonCard from "@/components/stage/LessonCard";
import { useLayout } from "@/components/providers/LayoutProvider";

interface Lesson {
  id: number;
  title: string;
  type: string;
  contentValue: string;
  progress: { id: number }[];
}

interface StageData {
  id: number;
  title: string;
  description: string | null;
  iconKey: string | null;
  lessons: Lesson[];
}

export default function StagePage({ params }: { params: { stageId: string } }) {
  const router = useRouter();
  const { mode } = useLayout();
  const [data, setData] = useState<StageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStage = async () => {
      try {
        const res = await fetch(`/api/stages/${params.stageId}`);
        if (res.ok) {
          const stageData = await res.json();
          setData(stageData);
        }
      } catch {
        console.error("Failed to fetch stage data");
      } finally {
        setLoading(false);
      }
    };

    fetchStage();
  }, [params.stageId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-16 h-16 border-4 border-ll-blue border-t-transparent rounded-full animate-spin" />
        <p className="font-black text-slate-400 uppercase tracking-widest animate-pulse">
          Opening book...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-black text-slate-800">Oops! Book not found.</h2>
        <Link href="/dashboard" className="text-ll-purple font-black mt-4 inline-block hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-ll-purple transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center text-5xl">
              {data.iconKey || "📚"}
            </div>
            <div>
              <h1 className={`font-black text-slate-800 tracking-tight transition-all duration-500 ${
                mode === "wide" ? "text-5xl" : "text-4xl"
              }`}>
                {data.title}
              </h1>
              <p className={`text-slate-400 font-bold mt-1 ${mode === "wide" ? "text-xl" : "text-lg"}`}>
                {data.description}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen().catch(() => {});
            }
            router.push(`/lesson/${data.lessons[0]?.id}/test`);
          }}
          className="bg-ll-green text-white font-black px-8 py-5 rounded-[2rem] shadow-xl hover:bg-ll-green-dark hover:shadow-ll-green/20 transition-all active:scale-95 text-center flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🏆</span>
          Test this Stage
        </button>
      </section>

      {/* Lesson Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={`font-black text-slate-700 ${mode === "wide" ? "text-3xl" : "text-2xl"}`}>
            Lessons in this Stage
          </h2>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {data.lessons.length} Lessons Available
          </span>
        </div>

        <div className={`grid gap-6 transition-all duration-500 ${
          mode === "mobile" 
            ? "grid-cols-1" 
            : mode === "laptop" 
            ? "grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-3 xl:grid-cols-4"
        }`}>
          {data.lessons.map((lesson) => (
            <LessonCard 
              key={lesson.id}
              {...lesson}
              isCompleted={lesson.progress && lesson.progress.length > 0}
              mode={mode}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
