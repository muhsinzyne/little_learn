import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let activeChildId = session.user.activeChildProfileId;

    // Verify existence or find fallback if needed
    let childExists = false;
    if (activeChildId) {
      const child = await prisma.childProfile.findUnique({
        where: { id: activeChildId },
        select: { id: true }
      });
      childExists = !!child;
    }

    if (!childExists) {
      const firstChild = await prisma.childProfile.findFirst({
        where: { userId: parseInt(session.user.id, 10) },
        orderBy: { createdAt: "asc" },
      });
      if (!firstChild) {
        return NextResponse.json({ error: "No child profiles found" }, { status: 404 });
      }
      activeChildId = firstChild.id;
    }

    let settings = await prisma.ttsSettings.findUnique({
      where: { childProfileId: activeChildId },
    });

    // If settings don't exist for this child (legacy data), create them
    if (!settings) {
      console.log(`Creating default TTS settings for child ${activeChildId}`);
      settings = await prisma.ttsSettings.create({
        data: {
          childProfileId: activeChildId,
          autoplay: true,
          soundEnabled: true,
          repeatCount: 1,
          speed: 1.0,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Fetch TTS settings error detail:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let activeChildId = session.user.activeChildProfileId;

    // Verify existence or find fallback if needed
    let childExists = false;
    if (activeChildId) {
      const child = await prisma.childProfile.findUnique({
        where: { id: activeChildId },
        select: { id: true }
      });
      childExists = !!child;
    }

    if (!childExists) {
      const firstChild = await prisma.childProfile.findFirst({
        where: { userId: parseInt(session.user.id, 10) },
        orderBy: { createdAt: "asc" },
      });
      if (!firstChild) {
        return NextResponse.json({ error: "No child profile to update settings for" }, { status: 400 });
      }
      activeChildId = firstChild.id;
    }

    const body = await req.json();
    const { autoplay, soundEnabled, repeatCount, speed, voiceName } = body;

    const settings = await prisma.ttsSettings.upsert({
      where: { childProfileId: activeChildId },
      update: {
        autoplay,
        soundEnabled,
        repeatCount: parseInt(repeatCount, 10),
        speed: parseFloat(speed),
        voiceName,
      },
      create: {
        childProfileId: activeChildId,
        autoplay: autoplay ?? true,
        soundEnabled: soundEnabled ?? true,
        repeatCount: parseInt(repeatCount, 10) || 1,
        speed: parseFloat(speed) || 1.0,
        voiceName,
      },
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Update TTS settings error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
