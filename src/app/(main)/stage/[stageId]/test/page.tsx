"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();

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
      const res = await fetch(`/api/stages/${stageId}/quiz`);
      if (res.ok) {
        const data = await res.json();
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
        <Link href="/dashboard" className="text-ll-purple font-black mt-4 inline-block hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link 
            href={`/stage/${stageId}`} 
            className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-ll-purple transition-colors uppercase tracking-widest"
          >
            <span>←</span> Exit Test
          </Link>
          <h1 className="text-3xl font-black text-slate-800">{quiz.stage.title}</h1>
        </div>
        
        {phase === "QUIZ" && (
          <div className="w-full md:w-64">
            <QuizProgressBar current={currentIndex + 1} total={quiz.questions.length} results={results} />
          </div>
        )}
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
    </div>
  );
}
