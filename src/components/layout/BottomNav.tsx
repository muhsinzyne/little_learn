"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/dashboard", icon: "🏠" },
    { label: "Progress", href: "/progress", icon: "📈" },
    { label: "Settings", href: "/settings", icon: "⚙️" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-20 px-6 flex items-center justify-around z-50 md:hidden pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              isActive ? "text-ll-purple scale-110" : "text-slate-400"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">
              {item.label}
            </span>
            {isActive && (
              <div className="h-1 w-4 bg-ll-purple rounded-full mt-0.5 animate-pulse" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
