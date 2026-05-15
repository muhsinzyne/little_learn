import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profiles = await prisma.childProfile.findMany({
    where: { userId: parseInt(session.user.id, 10) },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(profiles);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, age, avatarKey } = await req.json();

    if (!name || !age || !avatarKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const profile = await prisma.childProfile.create({
      data: {
        userId: parseInt(session.user.id, 10),
        name,
        age: parseInt(age, 10),
        avatarKey,
        // Initialize TTS settings
        ttsSettings: {
          create: {
            autoplay: true,
            repeatCount: 1,
            speed: 1.0,
          },
        },
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Create profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
