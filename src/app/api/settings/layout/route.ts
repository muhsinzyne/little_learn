import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id, 10) },
    select: { layoutPreference: true },
  });

  return NextResponse.json({ layoutPreference: user?.layoutPreference || "auto" });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { layoutPreference } = await req.json();

    if (!["auto", "mobile", "laptop", "wide"].includes(layoutPreference)) {
      return NextResponse.json({ error: "Invalid preference" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: parseInt(session.user.id, 10) },
      data: { layoutPreference },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update layout preference error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
