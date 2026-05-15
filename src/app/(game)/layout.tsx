import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { LayoutProvider } from "@/components/providers/LayoutProvider";
import FullscreenWrapper from "@/components/layout/FullscreenWrapper";

export default async function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id, 10) },
    select: { layoutPreference: true },
  });

  const initialPreference = user?.layoutPreference || "auto";

  return (
    <LayoutProvider initialPreference={initialPreference}>
      <FullscreenWrapper>
        {children}
      </FullscreenWrapper>
    </LayoutProvider>
  );
}
