"use client";

import React, { useState, useCallback } from "react";
import QuestionPrompt from "./QuestionPrompt";
import SpeakerButton from "../lesson/SpeakerButton";
import { useTts } from "@/hooks/useTts";

interface Option {
  value: string;
  label: string;
}

interface Question {
  lessonId: number;
  type: "LETTER" | "NUMBER" | "WORD" | "SHAPE" | "COLOR";
  prompt: string;
  promptImageKey: string | null;
  options: Option[];
  correctIndex: number;
}

interface QuizQuestionProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  ttsSettings: {
    soundEnabled: boolean;
    repeatCount: number;
    speed: number;
    voiceName: string | null;
  } | null;
}

export default function QuizQuestion({ question, onAnswer, ttsSettings }: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const { speak, isSpeaking } = useTts({
    repeatCount: 1, // Keep it simple for tests
    speed: ttsSettings?.speed ?? 1,
    voiceName: ttsSettings?.voiceName,
    soundEnabled: ttsSettings?.soundEnabled ?? true,
  });

  const speakPrompt = useCallback(() => {
    speak(question.prompt);
  }, [speak, question.prompt]);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    const isCorrect = index === question.correctIndex;
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
    }, 1500);
  };

  const getQuestionText = () => {
    switch (question.type) {
      case "LETTER": return "What letter is this?";
      case "NUMBER": return "What number is this?";
      case "WORD": return "Which word is this?";
      case "SHAPE": return "What shape is this?";
      case "COLOR": return "What color is this?";
      default: return "Can you find the answer?";
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 animate-in fade-in slide-in-from-bottom-8 duration-500 min-h-[60vh]">
      
      {/* Left/Top Area: Question and Prompt */}
      <div className="text-center space-y-6 md:space-y-8 flex-1 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
          {getQuestionText()}
        </h2>
        <div className="flex flex-col items-center gap-6 relative">
          <div className="scale-110 md:scale-125 transform origin-center transition-transform duration-500">
            <QuestionPrompt 
              type={question.type} 
              value={question.prompt} 
              imageKey={question.promptImageKey} 
            />
          </div>
        </div>
      </div>

      {/* Right/Bottom Area: Options */}
      <div className="flex-1 w-full max-w-2xl grid grid-cols-2 gap-4 md:gap-6">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctIndex;
          const isSelected = index === selected;
          const showCorrect = selected !== null && isCorrect;
          const showWrong = isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={selected !== null}
              className={`aspect-[4/3] flex items-center justify-center p-6 rounded-[2rem] border-4 transition-all duration-300 text-3xl font-black shadow-lg ${
                showCorrect 
                  ? "bg-ll-green border-ll-green text-white scale-105 animate-answer-correct" 
                  : showWrong 
                  ? "bg-ll-pink border-ll-pink text-white scale-95 animate-answer-wrong" 
                  : selected !== null && !isCorrect
                  ? "bg-white border-slate-100 opacity-50"
                  : "bg-white border-slate-100 hover:border-ll-purple hover:text-ll-purple hover:scale-[1.02] active:scale-95"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="capitalize">{option.label}</span>
                {showCorrect && <span className="text-4xl">✅</span>}
                {showWrong && <span className="text-4xl">❌</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
