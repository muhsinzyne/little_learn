import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stages = await prisma.stage.findMany({
      orderBy: { orderIndex: "asc" },
      include: {
        _count: {
          select: { lessons: true },
        },
      },
    });

    return NextResponse.json(stages);
  } catch (error) {
    console.error("Fetch stages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
