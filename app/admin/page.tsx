"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Upload, Check, ImageIcon } from "lucide-react";

// TEMPORARY client-side gate — replace with real auth (e.g. NextAuth, Clerk,
// or a server-checked session) before this goes live. This is just so we can
// see the admin UI shape before wiring up the backend.
const TEMP_ADMIN_PASSWORD = "changeme";

type SiteSettings = {
  companyName: string;
  tagline: string;
  logoUrl: string | null;
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);

  const [settings, setSettings] = useState<SiteSettings>({
    companyName: "RightBack Technology",
    tagline: "Precision machinery. Smarter production. Reliable performance.",
    logoUrl: null,
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (password === TEMP_ADMIN_PASSWORD) {
      setAuthed(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  }

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
    // TODO: once storage is wired up, upload `file` to Vercel Blob (or
    // similar) here and store the returned URL in settings.logoUrl instead.
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    // TODO: replace with a real API call once the database exists, e.g.
    // await fetch("/api/admin/site-settings", { method: "POST", body: ... })
    await new Promise((r) => setTimeout(r, 600));
    console.log("Saving site settings (placeholder):", settings);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-6">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onSubmit={handleLogin}
          className="bg-white rounded-2xl border border-black/10 shadow-sm p-8 w-full max-w-sm"
        >
          <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center mb-5">
            <Lock size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-black mb-1">Admin Access</h1>
          <p className="text-sm text-black/50 mb-6">
            Enter the admin password to manage site settings.
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAuthError(false);
            }}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red/40 transition-all"
            autoFocus
          />

          <AnimatePresence>
            {authError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-red mt-2"
              >
                Incorrect password. Try again.
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full mt-5 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/85 transition-colors"
          >
            Log in
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-red font-semibold tracking-wide uppercase text-xs mb-2">
            Admin
          </p>
          <h1 className="text-3xl font-bold text-black">Site Settings</h1>
          <p className="text-black/50 mt-2 text-[15px]">
            Changes here update the logo, name, and tagline everywhere across the site.
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl border border-black/10 shadow-sm p-8 space-y-8"
        >
          {/* Logo */}
          <div>
            <label className="block text-sm font-semibold text-black mb-3">
              Logo
            </label>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-xl bg-neutral-100 border border-black/10 flex items-center justify-center overflow-hidden shrink-0">
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon size={22} className="text-black/20" strokeWidth={1.5} />
                )}
              </div>
              <div>
                <label
                  htmlFor="logo-upload"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 text-sm font-medium text-black hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <Upload size={14} />
                  Upload new logo
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <p className="text-xs text-black/40 mt-2">
                  PNG or SVG recommended. Replaces the logo site-wide.
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-black/5" />

          {/* Company name */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) =>
                setSettings((s) => ({ ...s, companyName: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red/40 transition-all"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) =>
                setSettings((s) => ({ ...s, tagline: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/85 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>

            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-sm text-green-700"
                >
                  <Check size={15} />
                  Saved
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </div>
  );
}