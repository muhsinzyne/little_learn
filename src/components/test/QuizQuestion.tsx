"use client";

import React, { useState } from "react";
import QuestionPrompt from "./QuestionPrompt";

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
}

export default function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);

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
    <div className="flex flex-col items-center gap-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          {getQuestionText()}
        </h2>
        <QuestionPrompt 
          type={question.type} 
          value={question.prompt} 
          imageKey={question.promptImageKey} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
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
              className={`aspect-[16/10] sm:aspect-square flex items-center justify-center p-6 rounded-[2rem] border-4 transition-all duration-300 text-2xl font-black shadow-lg ${
                showCorrect 
                  ? "bg-ll-green border-ll-green text-white scale-105 animate-answer-correct" 
                  : showWrong 
                  ? "bg-ll-pink border-ll-pink text-white scale-95 animate-answer-wrong" 
                  : selected !== null && !isCorrect
                  ? "bg-white border-slate-100 opacity-50"
                  : "bg-white border-slate-100 hover:border-ll-purple hover:text-ll-purple active:scale-95"
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
