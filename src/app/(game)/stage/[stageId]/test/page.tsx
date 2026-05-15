"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import QuizProgressBar from "@/components/test/QuizProgressBar";
import QuizQuestion from "@/components/test/QuizQuestion";
import QuizResults from "@/components/test/QuizResults";
import MilestoneCelebration from "@/components/test/MilestoneCelebration";
import SpeakerButton from "@/components/lesson/SpeakerButton";
import { useTts } from "@/hooks/useTts";

interface Question {
  lessonId: number;
  type: "LETTER" | "NUMBER" | "WORD" | "SHAPE" | "COLOR";
  prompt: string;
  promptImageKey: string | null;
  options: { value: string; label: string }[];
  correctIndex: number;
}

interface QuizData {
  stage: { id: number; title: string };
  questions: Question[];
}

interface TtsSettings {
  autoplay: boolean;
  soundEnabled: boolean;
  repeatCount: number;
  speed: number;
  voiceName: string | null;
}

export default function StageTestPage() {
  const { stageId } = useParams();

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<(boolean | null)[]>([]);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"QUIZ" | "RESULTS">("QUIZ");
  const [milestoneEarned, setMilestoneEarned] = useState(false);
  const [stageName, setStageName] = useState("");
  const [ttsSettings, setTtsSettings] = useState<TtsSettings | null>(null);

  const fetchQuiz = useCallback(async () => {
    setLoading(true);
    setPhase("QUIZ");
    setCurrentIndex(0);
    setResults([]);
    setScore(0);
    setMilestoneEarned(false);

    try {
      const [quizRes, ttsRes] = await Promise.all([
        fetch(`/api/stages/${stageId}/quiz`),
        fetch("/api/tts-settings")
      ]);

      if (quizRes.ok) {
        const data = await quizRes.json();
        setQuiz(data);
        setResults(new Array(data.questions.length).fill(null));
      }

      if (ttsRes.ok) {
        setTtsSettings(await ttsRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch quiz or settings", error);
    } finally {
      setLoading(false);
    }
  }, [stageId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const { speak, isSpeaking } = useTts({
    repeatCount: 1,
    speed: ttsSettings?.speed ?? 1,
    voiceName: ttsSettings?.voiceName,
    soundEnabled: ttsSettings?.soundEnabled ?? true,
  });

  const speakCurrentPrompt = useCallback(() => {
    if (quiz && quiz.questions[currentIndex]) {
      speak(quiz.questions[currentIndex].prompt);
    }
  }, [quiz, currentIndex, speak]);

  // Autoplay for quiz
  useEffect(() => {
    if (!loading && quiz && ttsSettings?.autoplay && phase === "QUIZ") {
      const timer = setTimeout(() => {
        speakCurrentPrompt();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, quiz, currentIndex, ttsSettings?.autoplay, speakCurrentPrompt, phase]);

  const handleAnswer = async (correct: boolean) => {
    const newResults = [...results];
    newResults[currentIndex] = correct;
    setResults(newResults);

    if (correct) {
      setScore((s) => s + 1);
    }

    if (currentIndex < quiz!.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // End of quiz
      const finalScore = score + (correct ? 1 : 0);
      setPhase("RESULTS");
      
      // Save result
      try {
        const res = await fetch(`/api/stages/${stageId}/test-result`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: finalScore, totalQuestions: quiz!.questions.length }),
        });
        if (res.ok) {
          const data = await res.json();
          setMilestoneEarned(data.milestoneEarned);
          setStageName(data.stageName);
        }
      } catch (error) {
        console.error("Failed to save test result", error);
      }
    }
  };

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
        <div className="w-16 h-16 border-4 border-ll-green border-t-transparent rounded-full animate-spin" />
        <p className="font-black text-slate-400 uppercase tracking-widest animate-pulse">
          Generating your quiz...
        </p>
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-black text-slate-800">No questions available!</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Absolute top-left subtle title to save space */}
      <div className="absolute top-0 left-0 z-10 opacity-60 hover:opacity-100 transition-opacity p-4 md:p-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{quiz.stage.title}</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Stage Test Mode</p>
      </div>

      {/* Content */}
      <div className="relative min-h-[500px]">
        {phase === "QUIZ" ? (
          <QuizQuestion 
            key={currentIndex}
            question={quiz.questions[currentIndex]} 
            onAnswer={handleAnswer} 
            ttsSettings={ttsSettings}
          />
        ) : (
          <QuizResults 
            score={score} 
            total={quiz.questions.length} 
            onTryAgain={fetchQuiz} 
          />
        )}
      </div>

      {/* Celebration Overlay */}
      {milestoneEarned && (
        <MilestoneCelebration stageName={stageName} />
      )}

      {/* Unified Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 p-4 z-50 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          <button
            onClick={toggleSound}
            className={`w-14 h-14 rounded-2xl flex flex-shrink-0 items-center justify-center transition-all active:scale-90 border-2 ${
              ttsSettings?.soundEnabled 
                ? "bg-ll-purple/10 text-ll-purple border-ll-purple/20 hover:bg-ll-purple hover:text-white" 
                : "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200"
            }`}
            title={ttsSettings?.soundEnabled ? "Mute Sound" : "Enable Sound"}
          >
            <span className="text-2xl">{ttsSettings?.soundEnabled ? "🔊" : "🔇"}</span>
          </button>

          {phase === "QUIZ" && (
            <>
              <div className="flex flex-col items-center">
                <SpeakerButton 
                  onSpeak={speakCurrentPrompt} 
                  isSpeaking={isSpeaking} 
                  disabled={!ttsSettings?.soundEnabled}
                  size="sm"
                />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {ttsSettings?.soundEnabled ? (isSpeaking ? "Listening..." : "Click to hear") : "Muted"}
                </p>
              </div>

              <div className="flex-1 max-w-md mx-auto hidden md:block">
                <QuizProgressBar current={currentIndex + 1} total={quiz.questions.length} results={results} />
              </div>
            </>
          )}

          {/* Spacer to balance the layout if progress bar is hidden on mobile */}
          <div className="w-14 md:hidden"></div>
        </div>
      </div>
    </div>
  );
}
