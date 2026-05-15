"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface StageProgress {
  id: number;
  title: string;
  totalLessons: number;
  completedLessons: number;
  milestoneEarned: boolean;
}

interface TestHistory {
  id: number;
  stageName: string;
  score: number;
  totalQuestions: number;
  takenAt: string;
}

interface ProgressData {
  totalStars: number;
  overallCompletion: number;
  stageProgress: StageProgress[];
  testHistory: TestHistory[];
}

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProgressData | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progress");
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch progress", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse">Checking your progress...</div>;
  if (!data) return <div className="text-center p-20 text-slate-400 font-bold uppercase tracking-widest">No progress found. Start learning!</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-left-8 duration-700">
      <header>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Your Progress</h1>
        <p className="text-slate-400 font-bold text-lg mt-1">Look at how much you&apos;ve learned!</p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border-4 border-ll-purple/10 shadow-xl flex items-center gap-8 group hover:scale-[1.02] transition-transform">
          <div className="w-24 h-24 bg-ll-purple/10 rounded-3xl flex items-center justify-center text-5xl">⭐</div>
          <div>
            <div className="text-5xl font-black text-slate-800">{data.totalStars}</div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Total Stars</div>
          </div>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border-4 border-ll-blue/10 shadow-xl flex items-center gap-8 group hover:scale-[1.02] transition-transform">
          <div className="w-24 h-24 bg-ll-blue/10 rounded-3xl flex items-center justify-center text-5xl text-ll-blue">🏆</div>
          <div className="flex-1">
            <div className="text-5xl font-black text-slate-800">{data.overallCompletion}%</div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Overall Completion</div>
            <div className="h-3 bg-slate-50 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-ll-blue rounded-full transition-all duration-1000" 
                style={{ width: `${data.overallCompletion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stage Breakdown */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📚</span>
          <h2 className="text-2xl font-black text-slate-700">Stage-by-Stage</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.stageProgress.map(s => (
            <div key={s.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex-1 mr-6">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-black text-slate-800 truncate">{s.title}</h4>
                  {s.milestoneEarned && <span className="text-xl" title="Milestone Earned!">🏅</span>}
                </div>
                <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  <span>{s.completedLessons} / {s.totalLessons} Lessons</span>
                  <span>{Math.round((s.completedLessons / s.totalLessons) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-ll-green rounded-full transition-all duration-1000"
                    style={{ width: `${(s.completedLessons / s.totalLessons) * 100}%` }}
                  />
                </div>
              </div>
              <Link 
                href={`/stage/${s.id}`}
                className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-ll-purple hover:text-white transition-all flex items-center justify-center font-black"
              >
                →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Test History */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⏱️</span>
          <h2 className="text-2xl font-black text-slate-700">Test History</h2>
        </div>
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="p-8 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="p-8 text-xs font-black text-slate-400 uppercase tracking-widest">Stage</th>
                <th className="p-8 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {data.testHistory.map(ts => (
                <tr key={ts.id} className="border-b border-slate-50 last:border-0 group hover:bg-slate-50 transition-colors">
                  <td className="p-8 font-bold text-slate-400 text-sm">
                    {new Date(ts.takenAt).toLocaleDateString()}
                  </td>
                  <td className="p-8 font-black text-slate-700">
                    {ts.stageName}
                  </td>
                  <td className="p-8 text-center">
                    <span className="bg-ll-yellow/20 text-ll-orange font-black px-4 py-2 rounded-xl text-lg shadow-sm">
                      ⭐ {ts.score} / {ts.totalQuestions}
                    </span>
                  </td>
                </tr>
              ))}
              {data.testHistory.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-slate-300 font-bold uppercase tracking-widest text-sm">
                    No tests taken yet. Ready to try?
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
