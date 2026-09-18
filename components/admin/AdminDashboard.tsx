"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Check,
  ImageIcon,
  LayoutDashboard,
  Palette,
  Phone,
  Share2,
  Settings as SettingsIcon,
  LogOut,
  Images,
  Trash2,
  X,
  Package,
} from "lucide-react";
import ProductsManager from "@/components/admin/ProductsManager";

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
  { key: "products", label: "Products", icon: Package },
  { key: "branding", label: "Branding", icon: Palette },
  { key: "media", label: "Media Library", icon: Images },
  { key: "contact", label: "Contact Info", icon: Phone },
  { key: "social", label: "Social Links", icon: Share2 },
] as const;

type MediaItem = {
  id: string;
  url: string;
  name: string;
};

type SectionKey = (typeof navSections)[number]["key"];

export default function AdminDashboard() {
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<SectionKey>("general");
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function handleMediaUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const newItems: MediaItem[] = Array.from(files).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setMediaItems((items) => [...newItems, ...items]);
    e.target.value = "";
  }

  function handleMediaDelete(id: string) {
    setMediaItems((items) => items.filter((item) => item.id !== id));
  }

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    // TODO: replace with a real API call to persist site_settings.
    await new Promise((r) => setTimeout(r, 600));
    console.log("Saving site settings (placeholder):", settings);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
            onClick={handleLogout}
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

          {activeSection === "products" ? (
            <ProductsManager />
          ) : (
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

              {activeSection === "media" && (
                <motion.div
                  key="media"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <label className="block text-sm font-semibold text-black">
                        Product & Site Photos
                      </label>
                      <p className="text-xs text-black/40 mt-1">
                        Upload photos here, then assign them to a product or page.
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="media-upload"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-red text-sm font-medium text-black hover:bg-red hover:text-white cursor-pointer transition-all duration-300 whitespace-nowrap"
                      >
                        <Upload size={14} />
                        Upload photos
                      </label>
                      <input
                        id="media-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMediaUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {mediaItems.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-black/15 py-14 flex flex-col items-center justify-center gap-2 text-black/30">
                      <Images size={28} strokeWidth={1.5} />
                      <span className="text-sm">No photos uploaded yet</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {mediaItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-black/10 cursor-pointer"
                          onClick={() => setLightboxItem(item)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMediaDelete(item.id);
                            }}
                            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red hover:text-white"
                          >
                            <Trash2 size={13} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
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
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl overflow-hidden max-w-lg w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxItem.url}
                alt={lightboxItem.name}
                className="w-full max-h-[60vh] object-contain bg-neutral-100"
              />
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-sm text-black/60 truncate">
                  {lightboxItem.name}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleMediaDelete(lightboxItem.id);
                      setLightboxItem(null);
                    }}
                    className="p-2 rounded-full hover:bg-red hover:text-white transition-colors text-black/50"
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    onClick={() => setLightboxItem(null)}
                    className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-black/50"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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