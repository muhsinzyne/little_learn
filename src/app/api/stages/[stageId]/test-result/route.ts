import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { stageId: string } }
) {
  const session = await getServerSession(authOptions);
  const activeChildId = session?.user?.activeChildProfileId;

  if (!session || !activeChildId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stageId = parseInt(params.stageId, 10);
    const { score, totalQuestions } = await req.json();

    // 1. Save Test Session
    const testSession = await prisma.testSession.create({
      data: {
        childProfileId: activeChildId,
        stageId,
        score,
        totalQuestions,
      },
    });

    // 2. Check for Milestone
    // Get all lessons in this stage
    const stage = await prisma.stage.findUnique({
      where: { id: stageId },
      include: {
        lessons: {
          include: {
            progress: {
              where: { childProfileId: activeChildId, completed: true }
            }
          }
        }
      }
    });

    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    const allCompleted = stage.lessons.every(lesson => lesson.progress.length > 0);
    
    let milestoneEarned = false;
    if (allCompleted) {
      // Check if milestone already exists
      const existingMilestone = await prisma.milestone.findUnique({
        where: {
          childProfileId_stageId: {
            childProfileId: activeChildId,
            stageId
          }
        }
      });

      if (!existingMilestone) {
        await prisma.milestone.create({
          data: {
            childProfileId: activeChildId,
            stageId
          }
        });
        milestoneEarned = true;
      }
    }

    return NextResponse.json({
      testSession,
      milestoneEarned,
      stageName: stage.title
    });
  } catch (error) {
    console.error("Save test result error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
