"use client";

import React, { useState } from "react";
import AvatarPicker from "@/components/avatars/AvatarPicker";

interface AddChildModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddChildModal({ onClose, onSuccess }: AddChildModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "3",
    avatarKey: "avatar-bear",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/child-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create profile");
        setLoading(false);
        return;
      }

      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-slate-800">Add a Child</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-400">
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Child&apos;s First Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Maya"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-ll-purple rounded-2xl outline-none transition-all font-medium text-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">How old are they?</label>
            <select
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-ll-purple rounded-2xl outline-none transition-all font-medium appearance-none"
            >
              <option value="3">3 Years Old</option>
              <option value="4">4 Years Old</option>
              <option value="5">5 Years Old</option>
              <option value="6">6 Years Old</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-1">Pick an Avatar</label>
            <AvatarPicker
              selectedKey={formData.avatarKey}
              onSelect={(key) => setFormData({ ...formData, avatarKey: key })}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 font-black rounded-3xl hover:bg-slate-200 transition-all active:scale-95 uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-2 px-8 py-4 bg-ll-purple text-white font-black rounded-3xl shadow-xl hover:bg-ll-purple-dark hover:shadow-ll-purple/20 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-wider"
            >
              {loading ? "Saving..." : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
