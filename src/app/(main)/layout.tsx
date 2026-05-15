import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import { LayoutProvider } from "@/components/providers/LayoutProvider";
import ResponsiveContent from "@/components/layout/ResponsiveContent";

export default async function MainLayout({
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
    select: { layoutPreference: true, name: true },
  });

  const firstName = user?.name?.split(" ")[0] || "Parent";
  const initialPreference = user?.layoutPreference || "auto";

  return (
    <LayoutProvider initialPreference={initialPreference}>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-nunito relative">
        <Sidebar />
        
        <ResponsiveContent firstName={firstName}>
          {children}
        </ResponsiveContent>

        <BottomNav />
      </div>
    </LayoutProvider>
  );
}
