"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload,
  ImageIcon,
  X,
} from "lucide-react";

type Banner = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link_url: string;
  cta_label: string;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
};

type Draft = {
  id: string | null;
  title: string;
  description: string;
  image_url: string | null;
  link_url: string;
  cta_label: string;
  is_active: boolean;
  starts_at: string;
  ends_at: string;
};

const emptyDraft: Draft = {
  id: null,
  title: "",
  description: "",
  image_url: null,
  link_url: "",
  cta_label: "",
  is_active: true,
  starts_at: "",
  ends_at: "",
};

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red/40 transition-all";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string) {
  if (!value) return null;
  return new Date(value).toISOString();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatus(b: Banner): { label: string; className: string } {
  const now = Date.now();
  if (!b.is_active) return { label: "Hidden", className: "bg-neutral-100 text-black/50" };
  if (b.starts_at && new Date(b.starts_at).getTime() > now) {
    return { label: "Scheduled", className: "bg-amber-50 text-amber-700" };
  }
  if (b.ends_at && new Date(b.ends_at).getTime() <= now) {
    return { label: "Expired", className: "bg-neutral-100 text-black/50" };
  }
  return { label: "Live", className: "bg-green-50 text-green-700" };
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-black mb-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-black/40 mt-1.5">{hint}</p>}
    </div>
  );
}

export default function BannersManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/banners");
    const data = await res.json();
    if (res.ok) setBanners(data.banners ?? []);
    setLoading(false);
  }

  function openNew() {
    setDraft({ ...emptyDraft });
  }

  function openEdit(b: Banner) {
    setDraft({
      id: b.id,
      title: b.title,
      description: b.description,
      image_url: b.image_url,
      link_url: b.link_url,
      cta_label: b.cta_label,
      is_active: b.is_active,
      starts_at: toLocalInput(b.starts_at),
      ends_at: toLocalInput(b.ends_at),
    });
  }

  function patchDraft<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await res.json();
    setUploading(false);
    if (res.ok) {
      patchDraft("image_url", data.url);
    } else {
      alert(`Image upload failed: ${data.error ?? "unknown error"}`);
    }
    e.target.value = "";
  }

  async function handleSave() {
    if (!draft) return;
    if (!draft.title.trim()) {
      alert("Please enter a title for the banner.");
      return;
    }
    if (draft.starts_at && draft.ends_at && new Date(draft.ends_at) <= new Date(draft.starts_at)) {
      alert("The end date must be after the start date.");
      return;
    }
    if (draft.link_url && !/^(\/|https?:\/\/)/.test(draft.link_url.trim())) {
      alert("Link must start with / (page on this site) or https://");
      return;
    }

    setSaving(true);
    const payload = {
      id: draft.id,
      title: draft.title.trim(),
      description: draft.description.trim(),
      image_url: draft.image_url,
      link_url: draft.link_url.trim(),
      cta_label: draft.cta_label.trim(),
      is_active: draft.is_active,
      starts_at: fromLocalInput(draft.starts_at),
      ends_at: fromLocalInput(draft.ends_at),
    };

    const res = await fetch("/api/admin/banners", {
      method: draft.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);

    if (res.ok) {
      setDraft(null);
      await load();
    } else {
      const err = await res.json();
      alert(`Failed to save banner: ${err.error ?? "unknown error"}`);
    }
  }

  async function toggleActive(b: Banner) {
    setBanners((list) => list.map((x) => (x.id === b.id ? { ...x, is_active: !x.is_active } : x)));
    const res = await fetch("/api/admin/banners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id, is_active: !b.is_active }),
    });
    if (!res.ok) {
      alert("Failed to update banner.");
      load();
    }
  }

  async function remove(b: Banner) {
    if (!confirm(`Delete the banner "${b.title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/banners?id=${b.id}`, { method: "DELETE" });
    if (res.ok) {
      setBanners((list) => list.filter((x) => x.id !== b.id));
    } else {
      alert("Failed to delete banner.");
    }
  }

  async function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= banners.length) return;
    const next = [...banners];
    [next[index], next[target]] = [next[target], next[index]];
    setBanners(next);
    const res = await fetch("/api/admin/banners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((b) => b.id) }),
    });
    if (!res.ok) {
      alert("Failed to reorder banners.");
      load();
    }
  }

  if (loading) {
    return <div className="text-black/40 text-sm py-10 text-center">Loading banners…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-black/50">
          Active banners rotate at the top of the home page in the order shown below.
        </p>
        <button
          type="button"
          onClick={openNew}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-red bg-red text-white text-sm font-medium hover:bg-red/90 hover:scale-105 transition-all duration-300"
        >
          <Plus size={14} />
          New banner
        </button>
      </div>

      {banners.length === 0 && (
        <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-10 text-center text-sm text-black/40">
          No banners yet. Create one to advertise on the home page.
        </div>
      )}

      <div className="space-y-3">
        {banners.map((b, i) => {
          const status = getStatus(b);
          return (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-black/10 shadow-sm p-4 flex items-center gap-4"
            >
              <div className="w-24 h-16 rounded-lg bg-neutral-100 border border-black/10 overflow-hidden shrink-0 flex items-center justify-center">
                {b.image_url ? (
                  <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={18} className="text-black/20" strokeWidth={1.5} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-black truncate">{b.title}</p>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${status.className}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-xs text-black/40 truncate">
                  {b.starts_at || b.ends_at
                    ? `${b.starts_at ? formatDate(b.starts_at) : "Now"} → ${b.ends_at ? formatDate(b.ends_at) : "No end date"}`
                    : "Always on"}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="p-2 text-black/30 hover:text-black disabled:opacity-20 disabled:hover:text-black/30"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === banners.length - 1}
                  aria-label="Move down"
                  className="p-2 text-black/30 hover:text-black disabled:opacity-20 disabled:hover:text-black/30"
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => toggleActive(b)}
                  aria-label={b.is_active ? "Hide banner" : "Show banner"}
                  className="p-2 text-black/30 hover:text-black"
                >
                  {b.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(b)}
                  aria-label="Edit banner"
                  className="p-2 text-black/30 hover:text-black"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(b)}
                  aria-label="Delete banner"
                  className="p-2 text-black/30 hover:text-red"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {draft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={() => !saving && setDraft(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-black">
                  {draft.id ? "Edit banner" : "New banner"}
                </h2>
                <button
                  type="button"
                  onClick={() => setDraft(null)}
                  aria-label="Close"
                  className="p-2 text-black/30 hover:text-black"
                >
                  <X size={16} />
                </button>
              </div>

              <Field label="Banner Image" hint="Wide images work best (about 1600 × 600). Text is overlaid on the left side.">
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded-xl bg-neutral-100 border border-black/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {draft.image_url ? (
                      <img src={draft.image_url} alt="Banner preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={20} className="text-black/20" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="banner-image-upload"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-red text-sm font-medium text-black hover:bg-red hover:text-white cursor-pointer transition-all duration-300"
                    >
                      <Upload size={14} />
                      {uploading ? "Uploading…" : draft.image_url ? "Replace image" : "Upload image"}
                    </label>
                    <input
                      id="banner-image-upload"
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {draft.image_url && (
                      <button
                        type="button"
                        onClick={() => patchDraft("image_url", null)}
                        className="block text-xs text-black/40 hover:text-red"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
              </Field>

              <Field label="Title">
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => patchDraft("title", e.target.value)}
                  placeholder="e.g. Summer Sale — 20% off all machines"
                  className={inputClass}
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={draft.description}
                  onChange={(e) => patchDraft("description", e.target.value)}
                  rows={3}
                  placeholder="Short supporting text (optional)"
                  className={inputClass}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Button Label">
                  <input
                    type="text"
                    value={draft.cta_label}
                    onChange={(e) => patchDraft("cta_label", e.target.value)}
                    placeholder="Learn more"
                    className={inputClass}
                  />
                </Field>
                <Field label="Button Link" hint="Use / for a page on this site, or a full https:// URL.">
                  <input
                    type="text"
                    value={draft.link_url}
                    onChange={(e) => patchDraft("link_url", e.target.value)}
                    placeholder="/products or https://..."
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Show From" hint="Leave empty to show immediately.">
                  <input
                    type="datetime-local"
                    value={draft.starts_at}
                    onChange={(e) => patchDraft("starts_at", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Hide After" hint="Leave empty to keep it up until you remove it.">
                  <input
                    type="datetime-local"
                    value={draft.ends_at}
                    onChange={(e) => patchDraft("ends_at", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>

              <label className="flex items-center gap-3 text-sm text-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.is_active}
                  onChange={(e) => patchDraft("is_active", e.target.checked)}
                  className="w-4 h-4 accent-red"
                />
                Visible on the home page
              </label>

              <div className="flex items-center gap-3 pt-2 border-t border-black/5">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || uploading}
                  className="mt-4 px-6 py-3 rounded-full border border-red bg-red text-white text-sm font-medium hover:bg-red/90 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
                >
                  {saving ? "Saving..." : draft.id ? "Save banner" : "Create banner"}
                </button>
                <button
                  type="button"
                  onClick={() => setDraft(null)}
                  disabled={saving}
                  className="mt-4 px-6 py-3 rounded-full border border-black/10 text-sm font-medium text-black/60 hover:text-black transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}