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

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const activeChildId = session?.user?.activeChildProfileId;

  if (!session || !activeChildId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { autoplay, repeatCount, speed, voiceName } = body;

    const settings = await prisma.ttsSettings.update({
      where: { childProfileId: activeChildId },
      data: {
        autoplay,
        repeatCount: parseInt(repeatCount, 10),
        speed: parseFloat(speed),
        voiceName,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Update TTS settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
