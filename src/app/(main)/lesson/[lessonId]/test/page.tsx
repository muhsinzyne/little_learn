"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LessonTestRedirectPage() {
  const { lessonId } = useParams();
  const router = useRouter();

  useEffect(() => {
    const resolveStageAndRedirect = async () => {
      try {
        const res = await fetch(`/api/lessons/${lessonId}`);
        if (res.ok) {
          const data = await res.json();
          router.replace(`/stage/${data.lesson.stageId}/test`);
        } else {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Failed to resolve stage for test redirect", error);
        router.replace("/dashboard");
      }
    };

    resolveStageAndRedirect();
  }, [lessonId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 border-4 border-ll-purple border-t-transparent rounded-full animate-spin" />
      <p className="font-black text-slate-400 uppercase tracking-widest animate-pulse">
        Setting up your test...
      </p>
    </div>
  );
}
