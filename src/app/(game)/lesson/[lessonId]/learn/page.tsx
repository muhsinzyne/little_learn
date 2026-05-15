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
  
  // Keyboard & UI States
  const [activeKeyHint, setActiveKeyHint] = useState<"prev" | "next" | "enter" | null>(null);
  const [showStageComplete, setShowStageComplete] = useState(false);
  const [showHintBar, setShowHintBar] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

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
    
    const textToSpeak = lesson.type === "LETTER" 
      ? lesson.contentValue.toLowerCase() 
      : lesson.contentValue;
    
    speak(textToSpeak);
  }, [lesson, speak]);

  const { prevId, nextId } = useMemo(() => {
    if (!lesson || siblings.length === 0) return { prevId: null, nextId: null };
    
    const currentIndex = siblings.findIndex(s => s.id === lesson.id);
    return {
      prevId: currentIndex > 0 ? siblings[currentIndex - 1].id : null,
      nextId: currentIndex < siblings.length - 1 ? siblings[currentIndex + 1].id : null,
    };
  }, [lesson, siblings]);

  const handleNext = useCallback(() => {
    if (nextId) {
      router.push(`/lesson/${nextId}/learn`);
    } else {
      setShowStageComplete(true);
    }
  }, [nextId, router]);

  const handlePrev = useCallback(() => {
    if (prevId) {
      router.push(`/lesson/${prevId}/learn`);
    }
  }, [prevId, router]);

  const markAsLearned = useCallback(async () => {
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
  }, [isCompleted, lessonId, savingProgress]);

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      setLastActivity(Date.now());
      setShowHintBar(true);

      switch (e.code) {
        case "ArrowRight":
        case "Space":
          e.preventDefault();
          setActiveKeyHint("next");
          handleNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          setActiveKeyHint("prev");
          handlePrev();
          break;
        case "Enter":
          e.preventDefault();
          setActiveKeyHint("enter");
          await markAsLearned();
          setTimeout(() => {
            handleNext();
          }, 600);
          break;
        case "Escape":
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("request-exit-confirm"));
          break;
      }

      // Reset hint highlight
      setTimeout(() => setActiveKeyHint(null), 300);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, markAsLearned]);

  // Inactivity Timer for Hint Bar
  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() - lastActivity > 5000) {
        setShowHintBar(false);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastActivity]);

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
    setTtsSettings({ ...ttsSettings, soundEnabled: newState });
    try {
      await fetch("/api/tts-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ttsSettings, soundEnabled: newState }),
      });
    } catch (error) {
      console.error("Failed to toggle sound", error);
      setTtsSettings(ttsSettings);
    }
  };

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
    if (showStageComplete) {
      return (
        <div className="flex flex-col items-center text-center animate-in zoom-in duration-500">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-5xl font-black text-ll-purple mb-2">Stage complete!</h2>
          <p className="text-slate-500 font-bold text-xl mb-10">You learned everything in this stage! Awesome job!</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <Link
              href={`/stage/${lesson.stageId}/test`}
              className="bg-ll-green text-white font-black px-10 py-6 rounded-3xl hover:bg-ll-green-dark transition-all active:scale-95 shadow-xl shadow-ll-green/20 text-xl uppercase tracking-widest flex items-center gap-3"
            >
              🏆 Take the Test
            </Link>
            <button
              onClick={() => {
                if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
                router.push("/dashboard");
              }}
              className="bg-slate-800 text-white font-black px-10 py-6 rounded-3xl hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-900/20 text-xl uppercase tracking-widest flex items-center gap-3"
            >
              🏠 Back to Map
            </button>
          </div>
        </div>
      );
    }

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
      <div className="absolute top-0 left-0 z-10 opacity-60 hover:opacity-100 transition-opacity">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{lesson.title}</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          {stage?.title} &bull; Lesson {lesson.orderIndex + 1}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] relative z-0 mt-12 md:mt-0">
        <div className="w-full flex justify-center scale-110 md:scale-125 transform origin-center transition-transform duration-500">
          {renderContent()}
        </div>
      </div>

      {/* Keyboard Hint Bar */}
      <div className={`fixed bottom-28 left-1/2 -translate-x-1/2 transition-all duration-700 flex items-center gap-6 px-6 py-2 rounded-full bg-slate-100/50 backdrop-blur-sm border border-slate-200/50 pointer-events-none z-40 ${
        showHintBar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-slate-400">
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500 shadow-sm">Space / →</span>
          <span>Next</span>
        </div>
        <div className="w-px h-3 bg-slate-300" />
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-slate-400">
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500 shadow-sm">←</span>
          <span>Back</span>
        </div>
        <div className="w-px h-3 bg-slate-300" />
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-slate-400">
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500 shadow-sm">Enter</span>
          <span>Mark Learned</span>
        </div>
        <div className="w-px h-3 bg-slate-300" />
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-slate-400">
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500 shadow-sm">Esc</span>
          <span>Exit</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 p-4 z-50 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
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
                onClick={handlePrev}
                disabled={!prevId}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  prevId 
                    ? `bg-white text-slate-600 shadow-sm hover:shadow active:scale-95 ${activeKeyHint === "prev" ? "ring-4 ring-ll-purple scale-110" : ""}` 
                    : "text-slate-300 cursor-not-allowed"
                }`}
              >
                <span className="text-2xl font-black">←</span>
              </button>
              <button
                onClick={handleNext}
                disabled={!nextId && !showStageComplete}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  nextId || showStageComplete
                    ? `bg-white text-slate-600 shadow-sm hover:shadow active:scale-95 ${activeKeyHint === "next" ? "ring-4 ring-ll-purple scale-110" : ""}` 
                    : "text-slate-300 cursor-not-allowed"
                }`}
              >
                <span className="text-2xl font-black">→</span>
              </button>
            </div>
          </div>

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
                  : `bg-ll-purple text-white hover:bg-ll-purple-dark hover:shadow-xl hover:shadow-ll-purple/20 ${activeKeyHint === "enter" ? "ring-4 ring-white ring-offset-2 scale-110" : ""}`
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
