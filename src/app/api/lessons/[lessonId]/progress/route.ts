import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  const session = await getServerSession(authOptions);
  const activeChildId = session?.user?.activeChildProfileId;

  if (!session || !activeChildId) {
    return NextResponse.json({ error: "Unauthorized or no active child profile" }, { status: 401 });
  }

  try {
    const lessonId = parseInt(params.lessonId, 10);
    
    const progress = await prisma.childLessonProgress.upsert({
      where: {
        childProfileId_lessonId: {
          childProfileId: activeChildId,
          lessonId: lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        childProfileId: activeChildId,
        lessonId: lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Update lesson progress error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
