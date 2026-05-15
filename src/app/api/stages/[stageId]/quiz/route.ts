import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { numberToWords } from "@/lib/numberToWords";

export async function GET(
  req: Request,
  { params }: { params: { stageId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stageId = parseInt(params.stageId, 10);
    const stage = await prisma.stage.findUnique({
      where: { id: stageId },
      include: {
        lessons: true,
      },
    });

    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    const allLessons = stage.lessons;
    if (allLessons.length === 0) {
      return NextResponse.json({ error: "No lessons in this stage" }, { status: 400 });
    }

    // Pick 10 random lessons as questions (or all if less than 10)
    const shuffledLessons = [...allLessons].sort(() => Math.random() - 0.5);
    const questionLessons = shuffledLessons.slice(0, 10);

    const questions = questionLessons.map((lesson) => {
      // Get 3 wrong options from the same stage
      const otherLessons = allLessons.filter((l) => l.id !== lesson.id);
      const shuffledOthers = [...otherLessons].sort(() => Math.random() - 0.5);
      const wrongLessons = shuffledOthers.slice(0, 3);

      const options = [lesson, ...wrongLessons].map((l) => {
        let label = l.contentValue;
        if (l.type === "NUMBER") {
          label = numberToWords(parseInt(l.contentValue, 10));
        } else if (l.type === "WORD" || l.type === "SHAPE" || l.type === "COLOR") {
          label = l.title; // capitalize etc
        }
        return { value: l.contentValue, label };
      });

      // Shuffle options
      const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
      const correctIndex = shuffledOptions.findIndex((o) => o.value === lesson.contentValue);

      return {
        lessonId: lesson.id,
        type: lesson.type,
        prompt: lesson.contentValue,
        promptImageKey: lesson.contentImageKey,
        options: shuffledOptions,
        correctIndex,
      };
    });

    return NextResponse.json({
      stage: { id: stage.id, title: stage.title },
      questions,
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
