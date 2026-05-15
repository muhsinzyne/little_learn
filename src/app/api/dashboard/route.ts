import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activeChildId = session.user.activeChildProfileId;

  try {
    // 1. Fetch Active Child Info
    const activeChild = activeChildId
      ? await prisma.childProfile.findUnique({
          where: { id: activeChildId },
          include: {
            _count: {
              select: {
                progress: { where: { completed: true } },
                milestones: true,
              },
            },
          },
        })
      : null;

    // 2. Fetch All Stages with detailed progress
    const stages = await prisma.stage.findMany({
      orderBy: { orderIndex: "asc" },
      include: {
        lessons: {
          select: {
            id: true,
            progress: activeChildId
              ? {
                  where: { childProfileId: activeChildId, completed: true },
                  select: { id: true },
                }
              : false,
          },
        },
        milestones: activeChildId
          ? {
              where: { childProfileId: activeChildId },
            }
          : false,
      },
    });

    // 3. Process data for frontend
    const processedStages = stages.map((stage) => {
      const totalLessons = stage.lessons.length;
      const completedLessons = stage.lessons.filter(
        (l) => (l.progress as { id: number }[])?.length > 0
      ).length;
      const isCompleted = totalLessons > 0 && completedLessons === totalLessons;
      const hasMilestone = stage.milestones?.length > 0;

      return {
        id: stage.id,
        title: stage.title,
        iconKey: stage.iconKey,
        totalLessons,
        completedLessons,
        isCompleted,
        hasMilestone,
        milestoneFlag: stage.milestoneFlag,
      };
    });

    return NextResponse.json({
      activeChild: activeChild
        ? {
            id: activeChild.id,
            name: activeChild.name,
            avatarKey: activeChild.avatarKey,
            totalCompletedLessons: activeChild._count.progress,
            totalMilestones: activeChild._count.milestones,
          }
        : null,
      stages: processedStages,
    });
  } catch (error) {
    console.error("Fetch dashboard data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
