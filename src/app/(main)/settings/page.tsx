"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useLayout } from "@/components/providers/LayoutProvider";
import { useSession } from "next-auth/react";

interface ChildProfile {
  id: number;
  name: string;
  age: number;
  avatarKey: string;
}

interface TtsSettings {
  autoplay: boolean;
  soundEnabled: boolean;
  repeatCount: number;
  speed: number;
  voiceName: string | null;
}

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const { preference, setPreference } = useLayout();
  
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [tts, setTts] = useState<TtsSettings | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [account, setAccount] = useState({ name: "", email: "", password: "" });
  
  const [savingTts, setSavingTts] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<number | null>(null);
  const [profileForm, setProfileForm] = useState({ name: "", age: "", avatarKey: "1" });

  const fetchData = useCallback(async () => {
    try {
      const [profilesRes, ttsRes] = await Promise.all([
        fetch("/api/child-profile"),
        fetch("/api/tts-settings"),
      ]);

      if (profilesRes.ok) setProfiles(await profilesRes.json());
      if (ttsRes.ok) setTts(await ttsRes.json());
      
      if (session?.user) {
        setAccount({ name: session.user.name || "", email: session.user.email || "", password: "" });
      }
    } catch (error) {
      console.error("Failed to fetch settings data", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      setAvailableVoices(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        setAvailableVoices(window.speechSynthesis.getVoices());
      };
    }
  }, [fetchData]);

  const saveTts = async (updates: Partial<TtsSettings>) => {
    if (!tts) return;
    const newTts = { ...tts, ...updates };
    setTts(newTts);
    setSavingTts(true);
    try {
      await fetch("/api/tts-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTts),
      });
    } catch (error) {
      console.error("Failed to save TTS settings", error);
    } finally {
      setSavingTts(false);
    }
  };

  const saveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAccount(true);
    try {
      const res = await fetch("/api/settings/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      });
      if (res.ok) {
        await updateSession();
        alert("Account updated successfully!");
      }
    } catch (error) {
      console.error("Failed to save account", error);
    } finally {
      setSavingAccount(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProfileId ? `/api/child-profile/${editingProfileId}` : "/api/child-profile";
    const method = editingProfileId ? "PUT" : "POST";
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      if (res.ok) {
        setEditingProfileId(null);
        setProfileForm({ name: "", age: "", avatarKey: "1" });
        fetchData();
      }
    } catch (error) {
      console.error("Failed to save profile", error);
    }
  };

  const deleteProfile = async (id: number) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;
    try {
      const res = await fetch(`/api/child-profile/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        if (session?.user?.activeChildProfileId === id) {
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      console.error("Failed to delete profile", error);
    }
  };

  const layoutOptions = [
    { id: "auto", title: "Automatic", desc: "Responsive sizing", icon: "✨" },
    { id: "mobile", title: "Mobile", desc: "Bottom bar layout", icon: "📱" },
    { id: "laptop", title: "Laptop", desc: "Sidebar layout", icon: "💻" },
    { id: "wide", title: "Wide TV", desc: "Oversized view", icon: "📺" },
  ];

  if (loading) return <div className="p-20 text-center animate-pulse">Loading settings...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-right-8 duration-700">
      <header>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Settings</h1>
        <p className="text-slate-400 font-bold text-lg mt-1">Make LittleLearn just right for you.</p>
      </header>

      {/* Layout Preferences */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎨</span>
          <h2 className="text-2xl font-black text-slate-700">Display Layout</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {layoutOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPreference(opt.id)}
              className={`p-6 rounded-[2rem] border-4 transition-all text-left ${
                preference === opt.id ? "border-ll-purple bg-ll-purple/5 shadow-lg" : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <div className="text-2xl mb-2">{opt.icon}</div>
              <div className="font-black text-xs uppercase tracking-widest text-slate-400">{opt.title}</div>
              <div className="text-[10px] font-bold text-slate-300 leading-tight">{opt.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* TTS Settings */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗣️</span>
            <h2 className="text-2xl font-black text-slate-700">Voice & Speech</h2>
          </div>
          {savingTts && <span className="text-xs font-black text-ll-purple animate-pulse uppercase">Saving...</span>}
        </div>

        {!tts ? (
          <div className="bg-slate-50 p-12 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
            <div className="text-4xl mb-4">👦</div>
            <h3 className="font-black text-slate-400 uppercase tracking-widest text-sm">No Child Profile Selected</h3>
            <p className="text-slate-300 font-bold text-xs mt-2">Add a child profile below to configure voice settings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex flex-col">
                  <span className="font-black text-slate-600 uppercase tracking-widest text-xs">Master Sound Switch</span>
                  <span className="text-[10px] font-bold text-slate-400">Turn all app audio on or off</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={tts.soundEnabled} 
                  onChange={(e) => saveTts({ soundEnabled: e.target.checked })}
                  className="w-6 h-6 accent-ll-purple"
                />
              </label>

              <div className={`space-y-4 transition-all duration-300 ${!tts.soundEnabled ? "opacity-30 pointer-events-none grayscale" : ""}`}>
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="font-black text-slate-600 uppercase tracking-widest text-xs">Autoplay Lessons</span>
                  <input 
                    type="checkbox" 
                    checked={tts.autoplay} 
                    onChange={(e) => saveTts({ autoplay: e.target.checked })}
                    className="w-6 h-6 accent-ll-purple"
                  />
                </label>
                
                <div className="space-y-2">
                  <span className="font-black text-slate-500 uppercase tracking-widest text-[10px] pl-4">Repeats</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 5].map(n => (
                      <button 
                        key={n}
                        disabled={!tts.soundEnabled}
                        onClick={() => saveTts({ repeatCount: n })}
                        className={`flex-1 py-3 rounded-xl font-black transition-all ${
                          tts.repeatCount === n ? "bg-ll-purple text-white shadow-md" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                        }`}
                      >
                        {n}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`space-y-4 transition-all duration-300 ${!tts.soundEnabled ? "opacity-30 pointer-events-none grayscale" : ""}`}>
              <div className="space-y-2">
                <span className="font-black text-slate-500 uppercase tracking-widest text-[10px] pl-4">Voice Speed</span>
                <div className="flex gap-2">
                  {[0.8, 1.0].map(s => (
                    <button 
                      key={s}
                      disabled={!tts.soundEnabled}
                      onClick={() => saveTts({ speed: s })}
                      className={`flex-1 py-3 rounded-xl font-black transition-all ${
                        tts.speed === s ? "bg-ll-blue text-white shadow-md" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {s === 0.8 ? "Slow" : "Normal"}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="font-black text-slate-500 uppercase tracking-widest text-[10px] pl-4">Voice Accent</span>
                <select 
                  disabled={!tts.soundEnabled}
                  value={tts.voiceName || ""} 
                  onChange={(e) => saveTts({ voiceName: e.target.value })}
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-600 appearance-none outline-none border-2 border-transparent focus:border-ll-purple transition-all"
                >
                  <option value="">Default Voice</option>
                  {availableVoices.map(v => (
                    <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Profile Management */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👦</span>
          <h2 className="text-2xl font-black text-slate-700">Child Profiles</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border-2 border-slate-100">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${p.avatarKey}`} alt="Avatar" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800">{p.name}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Age {p.age}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingProfileId(p.id);
                      setProfileForm({ name: p.name, age: p.age.toString(), avatarKey: p.avatarKey });
                    }}
                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-ll-blue hover:text-white transition-all flex items-center justify-center"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => deleteProfile(p.id)}
                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-ll-pink hover:text-white transition-all flex items-center justify-center"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleProfileSubmit} className="bg-ll-purple/5 p-8 rounded-[3rem] border-2 border-ll-purple/10 space-y-4">
            <h3 className="font-black text-ll-purple uppercase tracking-widest text-xs">
              {editingProfileId ? "Edit Profile" : "Add New Profile"}
            </h3>
            <input 
              required
              placeholder="Child's Name"
              value={profileForm.name}
              onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full p-4 rounded-2xl border-2 border-white focus:border-ll-purple outline-none font-bold"
            />
            <input 
              required
              type="number"
              placeholder="Age"
              value={profileForm.age}
              onChange={e => setProfileForm({ ...profileForm, age: e.target.value })}
              className="w-full p-4 rounded-2xl border-2 border-white focus:border-ll-purple outline-none font-bold"
            />
            <div className="flex gap-2">
              <button 
                type="submit" 
                className="flex-1 bg-ll-purple text-white font-black py-4 rounded-2xl shadow-lg hover:bg-ll-purple-dark transition-all"
              >
                {editingProfileId ? "Update" : "Create"}
              </button>
              {editingProfileId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingProfileId(null);
                    setProfileForm({ name: "", age: "", avatarKey: "1" });
                  }}
                  className="px-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 transition-all"
                >
                  ✕
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Account Settings */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔒</span>
          <h2 className="text-2xl font-black text-slate-700">Account Security</h2>
        </div>
        <form onSubmit={saveAccount} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <span className="font-black text-slate-400 uppercase tracking-widest text-[10px] pl-4">Parent Name</span>
            <input 
              value={account.name} 
              onChange={e => setAccount({ ...account, name: e.target.value })}
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-600 border-2 border-transparent focus:border-ll-blue outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <span className="font-black text-slate-400 uppercase tracking-widest text-[10px] pl-4">Email Address</span>
            <input 
              value={account.email} 
              onChange={e => setAccount({ ...account, email: e.target.value })}
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-600 border-2 border-transparent focus:border-ll-blue outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <span className="font-black text-slate-400 uppercase tracking-widest text-[10px] pl-4">New Password (Optional)</span>
            <input 
              type="password"
              placeholder="••••••••"
              value={account.password} 
              onChange={e => setAccount({ ...account, password: e.target.value })}
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-600 border-2 border-transparent focus:border-ll-blue outline-none transition-all"
            />
          </div>
          <div className="md:col-start-3">
            <button 
              disabled={savingAccount}
              className="w-full bg-ll-blue text-white font-black py-4 rounded-2xl shadow-xl hover:bg-ll-blue-dark transition-all disabled:opacity-50"
            >
              {savingAccount ? "Saving..." : "Update Account"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
