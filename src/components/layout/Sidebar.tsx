"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/auth/SignOutButton";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: "🏠", color: "hover:bg-ll-purple-light/10 hover:text-ll-purple" },
    { label: "Progress", href: "/progress", icon: "📈", color: "hover:bg-ll-pink-light/10 hover:text-ll-pink" },
    { label: "Settings", href: "/settings", icon: "⚙️", color: "hover:bg-ll-orange-light/10 hover:text-ll-orange" },
  ];

  return (
    <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-shrink-0 flex-col sticky top-0 h-screen z-20">
      <div className="p-8">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-ll-purple rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
            <span className="text-2xl">📚</span>
          </div>
          <span className="text-2xl font-black text-ll-purple tracking-tight">LittleLearn</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-3" aria-label="Main Navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-label={`Go to ${item.label}`}
            className={`flex items-center gap-4 px-6 py-4 font-bold rounded-[2rem] transition-all group ${
              pathname === item.href
                ? "bg-slate-50 text-slate-900 shadow-sm"
                : `text-slate-500 ${item.color}`
            }`}
          >
            <span className="text-2xl group-hover:scale-125 transition-transform">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100">
        <SignOutButton />
      </div>
    </aside>
  );
}
