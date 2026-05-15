"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import QuizProgressBar from "@/components/test/QuizProgressBar";
import QuizQuestion from "@/components/test/QuizQuestion";
import QuizResults from "@/components/test/QuizResults";
import MilestoneCelebration from "@/components/test/MilestoneCelebration";

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

  const fetchQuiz = useCallback(async () => {
    setLoading(true);
    setPhase("QUIZ");
    setCurrentIndex(0);
    setResults([]);
    setScore(0);
    setMilestoneEarned(false);

    try {
      const quizRes = await fetch(`/api/stages/${stageId}/quiz`);

      if (quizRes.ok) {
        const data = await quizRes.json();
        setQuiz(data);
        setResults(new Array(data.questions.length).fill(null));
      }
    } catch (error) {
      console.error("Failed to fetch quiz", error);
    } finally {
      setLoading(false);
    }
  }, [stageId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);



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
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
          
          {phase === "QUIZ" ? (
            <div className="flex-1 max-w-2xl mx-auto">
              <QuizProgressBar current={currentIndex + 1} total={quiz.questions.length} results={results} />
            </div>
          ) : (
            <div className="flex items-center gap-4 py-2">
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Test Completed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
