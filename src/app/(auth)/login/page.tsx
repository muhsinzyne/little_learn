"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again!");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100 animate-bounce">
          {error}
        </div>
      )}

      {showForgotMsg && (
        <div className="bg-ll-blue-light/20 text-ll-blue-dark p-4 rounded-2xl mb-6 text-sm font-bold border border-ll-blue-light/30">
          🚧 Forgot password feature is coming soon!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
          <input
            required
            name="email"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-ll-purple rounded-2xl outline-none transition-all font-medium"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-bold text-slate-700">Password</label>
            <button
              type="button"
              onClick={() => setShowForgotMsg(true)}
              className="text-xs font-bold text-ll-purple hover:underline"
            >
              Forgot?
            </button>
          </div>
          <input
            required
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-ll-purple rounded-2xl outline-none transition-all font-medium"
          />
        </div>

        <div className="flex items-center px-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-5 h-5 rounded-lg border-2 border-slate-200 text-ll-purple focus:ring-ll-purple transition-all"
            />
            <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
          </label>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-ll-purple text-white font-black py-4 rounded-3xl shadow-xl hover:bg-ll-purple-dark hover:shadow-ll-purple/20 transition-all active:scale-95 disabled:opacity-50 text-lg uppercase tracking-wider"
        >
          {loading ? "Signing in..." : "Log In"}
        </button>

        <p className="text-center text-slate-400 font-medium pt-2">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-ll-purple font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
