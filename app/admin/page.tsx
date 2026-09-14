"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Upload,
  Check,
  ImageIcon,
  LayoutDashboard,
  Palette,
  Phone,
  Share2,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";

// TEMPORARY client-side gate — replace with real auth (e.g. NextAuth, Clerk,
// or a server-checked session) before this goes live.
const TEMP_ADMIN_PASSWORD = "changeme";

type SiteSettings = {
  companyName: string;
  tagline: string;
  logoUrl: string | null;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
};

const defaultSettings: SiteSettings = {
  companyName: "RightBack Technology",
  tagline: "Precision machinery. Smarter production. Reliable performance.",
  logoUrl: null,
  email: "info@rightback.co.za",
  phone: "",
  address: "",
  facebook: "",
  instagram: "",
  linkedin: "",
};

const navSections = [
  { key: "general", label: "General", icon: LayoutDashboard },
  { key: "branding", label: "Branding", icon: Palette },
  { key: "contact", label: "Contact Info", icon: Phone },
  { key: "social", label: "Social Links", icon: Share2 },
] as const;

type SectionKey = (typeof navSections)[number]["key"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);

  const [activeSection, setActiveSection] = useState<SectionKey>("general");
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

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
    // TODO: upload to Vercel Blob (or similar) and store the returned URL.
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    // TODO: replace with a real API call once the database exists.
    await new Promise((r) => setTimeout(r, 600));
    console.log("Saving site settings (placeholder):", settings);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
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
          <h1 className="text-xl font-bold text-black mb-1">
            RightBack <span className="text-red">Admin</span>
          </h1>
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
            className="w-full mt-5 py-3 rounded-full border border-red text-black text-sm font-medium hover:bg-red hover:text-white transition-all duration-300"
          >
            Log in
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-cream border-r border-black/10 flex flex-col">
        <div className="px-6 py-5 border-b border-black/10">
          <span className="text-lg font-bold text-black">
            RightBack <span className="text-red">Admin</span>
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.key;
            return (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ color: isActive ? "#1A1A1A" : "#1A1A1A80" }}
              >
                {isActive && (
                  <motion.span
                    layoutId="admin-nav-pill"
                    className="absolute inset-0 rounded-xl bg-white shadow-sm border border-black/5"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10">{section.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-black/10">
          <button
            onClick={() => setAuthed(false)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-black/50 hover:text-red hover:bg-white transition-colors"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-14">
          <div className="mb-10">
            <p className="text-red font-semibold tracking-wide uppercase text-xs mb-2 flex items-center gap-1.5">
              <SettingsIcon size={12} />
              Site Settings
            </p>
            <h1 className="text-3xl font-bold text-black">
              {navSections.find((s) => s.key === activeSection)?.label}
            </h1>
            <p className="text-black/50 mt-2 text-[15px]">
              Changes here update automatically across the whole site.
            </p>
          </div>

          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl border border-black/10 shadow-sm p-8 space-y-8"
          >
            <AnimatePresence mode="wait">
              {activeSection === "general" && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <Field label="Company Name">
                    <input
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => update("companyName", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Tagline">
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => update("tagline", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </motion.div>
              )}

              {activeSection === "branding" && (
                <motion.div
                  key="branding"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
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
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-red text-sm font-medium text-black hover:bg-red hover:text-white cursor-pointer transition-all duration-300"
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
                </motion.div>
              )}

              {activeSection === "contact" && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <Field label="Email">
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Address">
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => update("address", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </motion.div>
              )}

              {activeSection === "social" && (
                <motion.div
                  key="social"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <Field label="Facebook URL">
                    <input
                      type="url"
                      value={settings.facebook}
                      onChange={(e) => update("facebook", e.target.value)}
                      placeholder="https://facebook.com/..."
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Instagram URL">
                    <input
                      type="url"
                      value={settings.instagram}
                      onChange={(e) => update("instagram", e.target.value)}
                      placeholder="https://instagram.com/..."
                      className={inputClass}
                    />
                  </Field>
                  <Field label="LinkedIn URL">
                    <input
                      type="url"
                      value={settings.linkedin}
                      onChange={(e) => update("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/company/..."
                      className={inputClass}
                    />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4 pt-2 border-t border-black/5">
              <button
                type="submit"
                disabled={saving}
                className="mt-6 px-6 py-3 rounded-full border border-red bg-red text-white text-sm font-medium hover:bg-red/90 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>

              <AnimatePresence>
                {saved && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-sm text-green-700 mt-6"
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
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red/40 transition-all";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-black mb-2">{label}</label>
      {children}
    </div>
  );
}