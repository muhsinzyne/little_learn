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
  soundEnabled: boolean;
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
    soundEnabled: ttsSettings?.soundEnabled ?? true,
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

  const toggleSound = async () => {
    if (!ttsSettings) return;
    const newState = !ttsSettings.soundEnabled;
    
    // Optimistic UI update
    setTtsSettings({ ...ttsSettings, soundEnabled: newState });
    
    try {
      await fetch("/api/tts-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ttsSettings, soundEnabled: newState }),
      });
    } catch (error) {
      console.error("Failed to toggle sound", error);
      // Revert on error
      setTtsSettings(ttsSettings);
    }
  };

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
    <div className="flex flex-col h-full animate-in fade-in duration-700 pb-24 relative">
      {/* Absolute top-left subtle title to save space */}
      <div className="absolute top-0 left-0 z-10 opacity-60 hover:opacity-100 transition-opacity">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{lesson.title}</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          {stage?.title} &bull; Lesson {lesson.orderIndex + 1}
        </p>
      </div>

      {/* Main Content Centered vertically and horizontally */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] relative z-0 mt-12 md:mt-0">
        <div className="w-full flex justify-center scale-110 md:scale-125 transform origin-center transition-transform duration-500">
          {renderContent()}
        </div>

      </div>

      {/* Unified Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 p-4 z-50 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Settings & Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 border-2 ${
                ttsSettings?.soundEnabled 
                  ? "bg-ll-purple/10 text-ll-purple border-ll-purple/20 hover:bg-ll-purple hover:text-white" 
                  : "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200"
              }`}
              title={ttsSettings?.soundEnabled ? "Mute Sound" : "Enable Sound"}
            >
              <span className="text-2xl">{ttsSettings?.soundEnabled ? "🔊" : "🔇"}</span>
            </button>

            <div className="flex bg-slate-100 rounded-2xl p-1 gap-1">
              <button
                onClick={() => prevId && router.push(`/lesson/${prevId}/learn`)}
                disabled={!prevId}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  prevId 
                    ? "bg-white text-slate-600 shadow-sm hover:shadow active:scale-95" 
                    : "text-slate-300 cursor-not-allowed"
                }`}
              >
                <span className="text-2xl font-black">←</span>
              </button>
              <button
                onClick={() => nextId && router.push(`/lesson/${nextId}/learn`)}
                disabled={!nextId}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  nextId 
                    ? "bg-white text-slate-600 shadow-sm hover:shadow active:scale-95" 
                    : "text-slate-300 cursor-not-allowed"
                }`}
              >
                <span className="text-2xl font-black">→</span>
              </button>
            </div>
          </div>

          {/* Center: Primary Interaction (Speaker) */}
          <div className="flex flex-col items-center">
            <SpeakerButton 
              onSpeak={speakContent} 
              isSpeaking={isSpeaking} 
              disabled={!ttsSettings?.soundEnabled}
              size="sm"
            />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              {ttsSettings?.soundEnabled ? (isSpeaking ? "Listening..." : "Click to hear") : "Muted"}
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <Link
              href={`/stage/${lesson.stageId}/test`}
              className="hidden md:flex bg-ll-green/10 text-ll-green font-black px-6 py-4 rounded-2xl hover:bg-ll-green hover:text-white transition-all active:scale-95 items-center justify-center text-sm uppercase tracking-widest border-2 border-ll-green/20"
            >
              🏆 Take Test
            </Link>

            <button
              onClick={markAsLearned}
              disabled={isCompleted || savingProgress}
              className={`px-8 py-4 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center gap-3 ${
                isCompleted
                  ? "bg-ll-yellow text-slate-700 shadow-inner"
                  : "bg-ll-purple text-white hover:bg-ll-purple-dark hover:shadow-xl hover:shadow-ll-purple/20"
              }`}
            >
              {isCompleted ? (
                <>
                  <span className="text-2xl animate-bounce">⭐</span>
                  Learned!
                </>
              ) : (
                <>
                  {savingProgress ? "Saving..." : "Learned"}
                  <span className="text-2xl">⭐</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
