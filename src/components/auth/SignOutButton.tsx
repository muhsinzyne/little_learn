"use client";

import { signOut } from "next-auth/react";
import React from "react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full flex items-center gap-4 px-6 py-4 text-slate-400 font-bold hover:bg-red-50 hover:text-red-500 rounded-[2rem] transition-all group"
    >
      <span className="text-xl group-hover:scale-125 transition-transform">🚪</span>
      Sign Out
    </button>
  );
}
