import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { childProfileId } = await req.json();

    if (!childProfileId) {
      return NextResponse.json(
        { error: "Missing childProfileId" },
        { status: 400 }
      );
    }

    // Verify ownership
    const profile = await prisma.childProfile.findFirst({
      where: {
        id: childProfileId,
        userId: parseInt(session.user.id, 10),
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found or access denied" },
        { status: 404 }
      );
    }

    // Set cookie for persistence across JWT refreshes/requests
    cookies().set("ll-active-child", childProfileId.toString(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Switch profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
