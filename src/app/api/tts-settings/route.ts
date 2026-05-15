import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const activeChildId = session?.user?.activeChildProfileId;

  if (!session || !activeChildId) {
    return NextResponse.json({ error: "Unauthorized or no active child profile" }, { status: 401 });
  }

  try {
    const settings = await prisma.ttsSettings.findUnique({
      where: { childProfileId: activeChildId },
    });

    if (!settings) {
      return NextResponse.json({ error: "TTS settings not found" }, { status: 404 });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Fetch TTS settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
