import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { stageId: string } }
) {
  const session = await getServerSession(authOptions);
  const activeChildId = session?.user?.activeChildProfileId;

  try {
    const stage = await prisma.stage.findUnique({
      where: { id: parseInt(params.stageId, 10) },
      include: {
        lessons: {
          orderBy: { orderIndex: "asc" },
          include: {
            progress: activeChildId
              ? {
                  where: { childProfileId: activeChildId },
                }
              : false,
          },
        },
      },
    });

    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    return NextResponse.json(stage);
  } catch (error) {
    console.error("Fetch stage detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
