import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, age, avatarKey } = await req.json();
    const profileId = parseInt(params.id, 10);

    // Verify ownership
    const existing = await prisma.childProfile.findUnique({
      where: { id: profileId },
    });

    if (!existing || existing.userId !== parseInt(session.user.id, 10)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const profile = await prisma.childProfile.update({
      where: { id: profileId },
      data: {
        name,
        age: parseInt(age, 10),
        avatarKey,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profileId = parseInt(params.id, 10);

    // Verify ownership
    const existing = await prisma.childProfile.findUnique({
      where: { id: profileId },
    });

    if (!existing || existing.userId !== parseInt(session.user.id, 10)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.childProfile.delete({
      where: { id: profileId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
