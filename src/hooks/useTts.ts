"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface UseTtsOptions {
  repeatCount: number;
  speed: number;
  voiceName?: string | null;
}

interface UseTtsReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
}

export function useTts({ repeatCount, speed, voiceName }: UseTtsOptions): UseTtsReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const repeatIndexRef = useRef(0);
  const textRef = useRef("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsSpeaking(false);
    repeatIndexRef.current = 0;
  }, []);

  const speakInternal = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(textRef.current);
    utterance.rate = speed;

    if (voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find((v) => v.name === voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      repeatIndexRef.current += 1;
      if (repeatIndexRef.current < repeatCount) {
        // Brief pause before repeating
        timeoutRef.current = setTimeout(() => {
          speakInternal();
        }, 800);
      } else {
        setIsSpeaking(false);
        repeatIndexRef.current = 0;
      }
    };

    utterance.onerror = (event) => {
      console.error("SpeechSynthesisUtterance error", event);
      setIsSpeaking(false);
      repeatIndexRef.current = 0;
    };

    window.speechSynthesis.speak(utterance);
  }, [speed, voiceName, repeatCount]);

  const speak = useCallback((text: string) => {
    stop();
    textRef.current = text;
    speakInternal();
  }, [stop, speakInternal]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { speak, stop, isSpeaking };
}
