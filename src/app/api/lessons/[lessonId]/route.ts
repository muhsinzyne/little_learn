import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  const session = await getServerSession(authOptions);
  const activeChildId = session?.user?.activeChildProfileId;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const lessonId = parseInt(params.lessonId, 10);
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        stage: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Fetch sibling lessons for navigation
    const siblings = await prisma.lesson.findMany({
      where: { stageId: lesson.stageId },
      orderBy: { orderIndex: "asc" },
      select: { id: true, orderIndex: true },
    });

    // Fetch progress for this specific child
    let progress = null;
    if (activeChildId) {
      progress = await prisma.childLessonProgress.findUnique({
        where: {
          childProfileId_lessonId: {
            childProfileId: activeChildId,
            lessonId: lessonId,
          },
        },
      });
    }

    return NextResponse.json({
      lesson,
      stage: lesson.stage,
      siblings,
      progress,
    });
  } catch (error) {
    console.error("Fetch lesson detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
