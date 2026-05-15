"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLayout } from "@/components/providers/LayoutProvider";
import LetterDisplay from "@/components/lesson/LetterDisplay";
import NumberDisplay from "@/components/lesson/NumberDisplay";
import WordDisplay from "@/components/lesson/WordDisplay";
import ShapeDisplay from "@/components/lesson/ShapeDisplay";
import ColorDisplay from "@/components/lesson/ColorDisplay";
import SpeakerButton from "@/components/lesson/SpeakerButton";
import { useTts } from "@/hooks/useTts";

interface Lesson {
  id: number;
  title: string;
  type: "LETTER" | "NUMBER" | "WORD" | "SHAPE" | "COLOR";
  contentValue: string;
  contentImageKey: string | null;
  stageId: number;
  orderIndex: number;
}

interface Sibling {
  id: number;
  orderIndex: number;
}

interface TtsSettings {
  autoplay: boolean;
  repeatCount: number;
  speed: number;
  voiceName: string | null;
}

export default function LessonLearnPage() {
  const { lessonId } = useParams();
  const router = useRouter();
  const { } = useLayout();
  
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [stage, setStage] = useState<{ id: number; title: string } | null>(null);
  const [siblings, setSiblings] = useState<Sibling[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [ttsSettings, setTtsSettings] = useState<TtsSettings | null>(null);
  const [savingProgress, setSavingProgress] = useState(false);

  const fetchLessonData = useCallback(async () => {
    try {
      const [lessonRes, ttsRes] = await Promise.all([
        fetch(`/api/lessons/${lessonId}`),
        fetch("/api/tts-settings"),
      ]);

      if (lessonRes.ok && ttsRes.ok) {
        const lessonData = await lessonRes.json();
        const ttsData = await ttsRes.json();

        setLesson(lessonData.lesson);
        setStage(lessonData.stage);
        setSiblings(lessonData.siblings);
        setIsCompleted(!!lessonData.progress);
        setTtsSettings(ttsData);
      }
    } catch (error) {
      console.error("Failed to fetch lesson data", error);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchLessonData();
  }, [fetchLessonData]);

  const { speak, isSpeaking } = useTts({
    repeatCount: ttsSettings?.repeatCount ?? 1,
    speed: ttsSettings?.speed ?? 1,
    voiceName: ttsSettings?.voiceName,
  });

  const speakContent = useCallback(() => {
    if (!lesson) return;
    
    let textToSpeak = lesson.contentValue;
    if (lesson.type === "LETTER") {
      textToSpeak = `The letter ${lesson.contentValue}`;
    } else if (lesson.type === "NUMBER") {
      // Handled by NumberDisplay utility but we can just use the value or the word.
      // Re-implementing a simple version here for TTS or we could export it.
      textToSpeak = lesson.contentValue; 
    }
    
    speak(textToSpeak);
  }, [lesson, speak]);

  // Autoplay logic
  useEffect(() => {
    if (!loading && lesson && ttsSettings?.autoplay) {
      const timer = setTimeout(() => {
        speakContent();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, lesson, ttsSettings?.autoplay, speakContent]);

  const markAsLearned = async () => {
    if (isCompleted || savingProgress) return;
    
    setSavingProgress(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/progress`, {
        method: "POST",
      });
      if (res.ok) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Failed to mark as learned", error);
    } finally {
      setSavingProgress(false);
    }
  };

  const { prevId, nextId } = useMemo(() => {
    if (!lesson || siblings.length === 0) return { prevId: null, nextId: null };
    
    const currentIndex = siblings.findIndex(s => s.id === lesson.id);
    return {
      prevId: currentIndex > 0 ? siblings[currentIndex - 1].id : null,
      nextId: currentIndex < siblings.length - 1 ? siblings[currentIndex + 1].id : null,
    };
  }, [lesson, siblings]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-ll-purple border-t-transparent rounded-full animate-spin" />
        <p className="font-black text-slate-400 uppercase tracking-widest animate-pulse">
          Preparing lesson...
        </p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-black text-slate-800">Oops! Lesson not found.</h2>
        <Link href="/dashboard" className="text-ll-purple font-black mt-4 inline-block hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const renderContent = () => {
    switch (lesson.type) {
      case "LETTER": return <LetterDisplay contentValue={lesson.contentValue} />;
      case "NUMBER": return <NumberDisplay contentValue={lesson.contentValue} />;
      case "WORD": return <WordDisplay contentValue={lesson.contentValue} contentImageKey={lesson.contentImageKey} />;
      case "SHAPE": return <ShapeDisplay contentValue={lesson.contentValue} />;
      case "COLOR": return <ColorDisplay contentValue={lesson.contentValue} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Breadcrumb & Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-wider">
          <Link href="/dashboard" className="hover:text-ll-purple transition-colors">Dashboard</Link>
          <span>/</span>
          {stage && (
            <>
              <Link href={`/stage/${stage.id}`} className="hover:text-ll-purple transition-colors max-w-[150px] truncate">
                {stage.title}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-600 truncate max-w-[150px]">{lesson.title}</span>
        </nav>

        <Link
          href={`/lesson/${siblings[0]?.id}/test`}
          className="bg-ll-green/10 text-ll-green font-black px-6 py-3 rounded-2xl hover:bg-ll-green hover:text-white transition-all active:scale-95 text-center text-sm uppercase tracking-widest border-2 border-ll-green/20"
        >
          🏆 Take Test
        </Link>
      </div>

      {/* Main Lesson Area */}
      <div className="flex flex-col items-center gap-12">
        <div className="w-full flex justify-center">
          {renderContent()}
        </div>

        {/* TTS Trigger */}
        <div className="flex flex-col items-center gap-4">
          <SpeakerButton onSpeak={speakContent} isSpeaking={isSpeaking} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
            {isSpeaking ? "Listening..." : "Click to hear"}
          </p>
        </div>
      </div>

      {/* Navigation & Progress */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-4 order-2 sm:order-1">
          <button
            onClick={() => prevId && router.push(`/lesson/${prevId}/learn`)}
            disabled={!prevId}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              prevId 
                ? "bg-white text-slate-600 shadow-lg border border-slate-100 hover:bg-slate-50 active:scale-90" 
                : "bg-slate-50 text-slate-200 cursor-not-allowed"
            }`}
          >
            <span className="text-2xl">←</span>
          </button>

          <button
            onClick={() => nextId && router.push(`/lesson/${nextId}/learn`)}
            disabled={!nextId}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              nextId 
                ? "bg-white text-slate-600 shadow-lg border border-slate-100 hover:bg-slate-50 active:scale-90" 
                : "bg-slate-50 text-slate-200 cursor-not-allowed"
            }`}
          >
            <span className="text-2xl">→</span>
          </button>
        </div>

        <button
          onClick={markAsLearned}
          disabled={isCompleted || savingProgress}
          className={`px-10 py-5 rounded-[2rem] font-black text-lg transition-all active:scale-95 shadow-xl flex items-center gap-3 order-1 sm:order-2 ${
            isCompleted
              ? "bg-ll-yellow text-slate-700 cursor-default"
              : "bg-ll-purple text-white hover:bg-ll-purple-dark hover:shadow-ll-purple/20"
          }`}
        >
          {isCompleted ? (
            <>
              <span className="text-2xl animate-bounce">⭐</span>
              Learned!
            </>
          ) : (
            <>
              {savingProgress ? "Saving..." : "Mark as Learned"}
              <span className="text-xl">⭐</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
