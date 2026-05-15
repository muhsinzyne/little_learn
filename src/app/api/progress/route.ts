import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const activeChildId = session?.user?.activeChildProfileId;

  if (!session || !activeChildId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Get total stars (sum of scores from TestSessions)
    const testSessions = await prisma.testSession.findMany({
      where: { childProfileId: activeChildId },
      include: {
        stage: {
          select: { title: true }
        }
      },
      orderBy: { takenAt: "desc" }
    });

    const totalStars = testSessions.reduce((sum, session) => sum + session.score, 0);

    // 2. Get stage-by-stage progress
    const stages = await prisma.stage.findMany({
      include: {
        lessons: {
          include: {
            progress: {
              where: { childProfileId: activeChildId, completed: true }
            }
          }
        },
        milestones: {
          where: { childProfileId: activeChildId }
        }
      },
      orderBy: { orderIndex: "asc" }
    });

    const stageProgress = stages.map(stage => {
      const totalLessons = stage.lessons.length;
      const completedLessons = stage.lessons.filter(l => l.progress.length > 0).length;
      return {
        id: stage.id,
        title: stage.title,
        totalLessons,
        completedLessons,
        milestoneEarned: stage.milestones.length > 0
      };
    });

    // 3. Overall completion %
    const totalPossibleLessons = stageProgress.reduce((sum, s) => sum + s.totalLessons, 0);
    const totalCompletedLessons = stageProgress.reduce((sum, s) => sum + s.completedLessons, 0);
    const overallCompletion = totalPossibleLessons > 0 
      ? Math.round((totalCompletedLessons / totalPossibleLessons) * 100) 
      : 0;

    return NextResponse.json({
      totalStars,
      overallCompletion,
      stageProgress,
      testHistory: testSessions.map(ts => ({
        id: ts.id,
        stageName: ts.stage.title,
        score: ts.score,
        totalQuestions: ts.totalQuestions,
        takenAt: ts.takenAt
      }))
    });
  } catch (error) {
    console.error("Fetch progress error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
