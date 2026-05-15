"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import AvatarPicker from "@/components/avatars/AvatarPicker";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    childName: "",
    childAge: "3",
    avatarKey: "avatar-bear",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Success - Automatically sign in to proceed to step 2
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Error signing in after registration");
        setLoading(false);
      } else {
        setStep(2);
        setLoading(false);
      }
    } catch {
      setError("Failed to register. Check your connection.");
      setLoading(false);
    }
  };

  const handleChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/child-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.childName,
          age: formData.childAge,
          avatarKey: formData.avatarKey,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create child profile");
        setLoading(false);
        return;
      }

      // Success!
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Failed to create profile. Check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-8">
        <div className={`h-2 w-8 rounded-full transition-all duration-300 ${step === 1 ? 'bg-ll-purple w-12' : 'bg-slate-200'}`}></div>
        <div className={`h-2 w-8 rounded-full transition-all duration-300 ${step === 2 ? 'bg-ll-purple w-12' : 'bg-slate-200'}`}></div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100 animate-bounce">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleParentSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Parent&apos;s Full Name</label>
            <input
              required
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-ll-purple rounded-2xl outline-none transition-all font-medium"
            />
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
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
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
              <input
                required
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-ll-purple rounded-2xl outline-none transition-all font-medium"
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-ll-purple text-white font-black py-4 rounded-3xl shadow-xl hover:bg-ll-purple-dark hover:shadow-ll-purple/20 transition-all active:scale-95 disabled:opacity-50 text-lg uppercase tracking-wider"
          >
            {loading ? "Creating Account..." : "Continue"}
          </button>

          <p className="text-center text-slate-400 font-medium pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-ll-purple font-bold hover:underline">
              Log In
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleChildSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-800">Who is learning?</h2>
            <p className="text-slate-400">Create the first profile for your child.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Child&apos;s First Name</label>
              <input
                required
                name="childName"
                type="text"
                placeholder="e.g. Leo"
                value={formData.childName}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-ll-purple rounded-2xl outline-none transition-all font-medium text-center text-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">How old are they?</label>
              <select
                name="childAge"
                value={formData.childAge}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-ll-purple rounded-2xl outline-none transition-all font-medium appearance-none text-center text-lg"
              >
                <option value="3">3 Years Old</option>
                <option value="4">4 Years Old</option>
                <option value="5">5 Years Old</option>
                <option value="6">6 Years Old</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 text-center block">Pick an Avatar</label>
              <AvatarPicker
                selectedKey={formData.avatarKey}
                onSelect={(key) => setFormData((prev) => ({ ...prev, avatarKey: key }))}
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-ll-pink text-white font-black py-4 rounded-3xl shadow-xl hover:bg-ll-pink-dark hover:shadow-ll-pink/20 transition-all active:scale-95 disabled:opacity-50 text-lg uppercase tracking-wider"
          >
            {loading ? "Creating Profile..." : "Start Learning!"}
          </button>
        </form>
      )}
    </div>
  );
}
