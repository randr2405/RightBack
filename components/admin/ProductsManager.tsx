"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  X,
  Check,
  GripVertical,
} from "lucide-react";

type Group = { label: string; items: string[] };
type Spec = { label: string; value: string };

type Product = {
  id: string;
  category: string;
  sort_order: number;
  brand: string;
  name: string;
  tagline: string | null;
  description: string[];
  more_info: string[];
  groups: Group[];
  specs: Spec[];
  image_url: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  "maica/shirt-technology": "Maica — Shirt Technology",
  "vibemac/jeans-technology": "Vibemac — Jeans Technology",
  "sewing/lockstitch": "Sewing — Lockstitch",
  "sewing/engineered-workstations": "Sewing — Engineered Workstations",
  "laser-machines": "Laser Machines",
  "cutting/cnc-cutting": "Cutting — CNC Cutting",
  "cutting/sample-cutting-machine": "Cutting — Sample Cutting Machine",
  "cutting/spreading-machine": "Cutting — Spreading Machine",
  "cad-pattern-design": "CAD Pattern Design",
  laundry: "Laundry",
  "print/dtf-printers": "Print — DTF Printers",
  "print/pattern-marker-plotters": "Print — Pattern Marker Plotters",
};

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }

  const categories = Array.from(new Set(products.map((p) => p.category)));

  function startNewProduct(category: string) {
    setEditing({
      id: "",
      category,
      sort_order: products.filter((p) => p.category === category).length,
      brand: "",
      name: "",
      tagline: "",
      description: [""],
      more_info: [],
      groups: [],
      specs: [],
      image_url: null,
    });
  }

  async function handleSave(product: Product) {
    setSaving(true);
    const isNew = !product.id;

    const res = await fetch(
      isNew ? "/api/admin/products" : `/api/admin/products/${product.id}`,
      {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      }
    );

    setSaving(false);

    if (res.ok) {
      setEditing(null);
      await loadProducts();
    } else {
      const err = await res.json();
      alert(`Failed to save: ${err.error ?? "unknown error"}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEditing(null);
      await loadProducts();
    } else {
      alert("Failed to delete product.");
    }
  }

  if (loading) {
    return <div className="text-black/40 text-sm py-10 text-center">Loading products…</div>;
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => {
        const items = products.filter((p) => p.category === category);
        const isOpen = openCategory === category;

        return (
          <div
            key={category}
            className="bg-white rounded-2xl border border-black/10 overflow-hidden"
          >
            <button
              onClick={() => setOpenCategory(isOpen ? null : category)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-black">
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                {CATEGORY_LABELS[category] ?? category}
              </span>
              <span className="text-xs text-black/40">{items.length} products</span>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-black/5"
                >
                  <div className="divide-y divide-black/5">
                    {items.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => setEditing(product)}
                        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <GripVertical size={14} className="text-black/20 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm text-black truncate">{product.name}</div>
                            <div className="text-xs text-black/40">{product.brand}</div>
                          </div>
                        </div>
                        {!product.image_url && (
                          <span className="text-[11px] text-black/30 shrink-0 ml-3">
                            No image
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-black/5">
                    <button
                      onClick={() => startNewProduct(category)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-red hover:text-black transition-colors"
                    >
                      <Plus size={14} />
                      Add product
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <AnimatePresence>
        {editing && (
          <ProductEditor
            product={editing}
            saving={saving}
            onClose={() => setEditing(null)}
            onSave={handleSave}
            onDelete={editing.id ? () => handleDelete(editing.id) : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductEditor({
  product,
  saving,
  onClose,
  onSave,
  onDelete,
}: {
  product: Product;
  saving: boolean;
  onClose: () => void;
  onSave: (p: Product) => void;
  onDelete?: () => void;
}) {
  const [form, setForm] = useState<Product>(product);

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateListItem(key: "description" | "more_info", index: number, value: string) {
    const next = [...form[key]];
    next[index] = value;
    update(key, next);
  }

  function addListItem(key: "description" | "more_info") {
    update(key, [...form[key], ""]);
  }

  function removeListItem(key: "description" | "more_info", index: number) {
    update(
      key,
      form[key].filter((_, i) => i !== index)
    );
  }

  function updateGroup(index: number, field: "label" | "items", value: string | string[]) {
    const next = [...form.groups];
    next[index] = { ...next[index], [field]: value } as Group;
    update("groups", next);
  }

  function addGroup() {
    update("groups", [...form.groups, { label: "New Group", items: [""] }]);
  }

  function removeGroup(index: number) {
    update(
      "groups",
      form.groups.filter((_, i) => i !== index)
    );
  }

  function updateGroupItem(groupIndex: number, itemIndex: number, value: string) {
    const next = [...form.groups];
    const items = [...next[groupIndex].items];
    items[itemIndex] = value;
    next[groupIndex] = { ...next[groupIndex], items };
    update("groups", next);
  }

  function addGroupItem(groupIndex: number) {
    const next = [...form.groups];
    next[groupIndex] = { ...next[groupIndex], items: [...next[groupIndex].items, ""] };
    update("groups", next);
  }

  function removeGroupItem(groupIndex: number, itemIndex: number) {
    const next = [...form.groups];
    next[groupIndex] = {
      ...next[groupIndex],
      items: next[groupIndex].items.filter((_, i) => i !== itemIndex),
    };
    update("groups", next);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">
            {form.id ? "Edit Product" : "New Product"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-neutral-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Brand">
              <input
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Name">
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Tagline">
            <input
              value={form.tagline ?? ""}
              onChange={(e) => update("tagline", e.target.value)}
              className={inputClass}
            />
          </Field>

          <RepeatableTextList
            label="Description"
            items={form.description}
            onChange={(i, v) => updateListItem("description", i, v)}
            onAdd={() => addListItem("description")}
            onRemove={(i) => removeListItem("description", i)}
          />

          <RepeatableTextList
            label="More Info"
            items={form.more_info}
            onChange={(i, v) => updateListItem("more_info", i, v)}
            onAdd={() => addListItem("more_info")}
            onRemove={(i) => removeListItem("more_info", i)}
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-black">Groups (bullet lists)</label>
              <button
                onClick={addGroup}
                className="text-xs font-medium text-red hover:text-black flex items-center gap-1"
              >
                <Plus size={12} /> Add group
              </button>
            </div>
            <div className="space-y-4">
              {form.groups.map((group, gi) => (
                <div key={gi} className="border border-black/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      value={group.label}
                      onChange={(e) => updateGroup(gi, "label", e.target.value)}
                      placeholder="Group label (e.g. Features)"
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      onClick={() => removeGroup(gi)}
                      className="p-2 text-black/30 hover:text-red"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {group.items.map((item, ii) => (
                      <div key={ii} className="flex items-center gap-2">
                        <input
                          value={item}
                          onChange={(e) => updateGroupItem(gi, ii, e.target.value)}
                          className={`${inputClass} flex-1 text-[13px]`}
                        />
                        <button
                          onClick={() => removeGroupItem(gi, ii)}
                          className="p-1.5 text-black/20 hover:text-red"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addGroupItem(gi)}
                      className="text-xs text-black/40 hover:text-red flex items-center gap-1"
                    >
                      <Plus size={11} /> Add item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-black/10 px-6 py-4 flex items-center justify-between">
          {onDelete ? (
            <button
              onClick={onDelete}
              className="text-sm font-medium text-black/40 hover:text-red flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-sm font-medium text-black/60 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(form)}
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-red text-white text-sm font-medium hover:bg-red/90 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? "Saving…" : (
                <>
                  <Check size={14} /> Save
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RepeatableTextList({
  label,
  items,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  items: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-black">{label}</label>
        <button onClick={onAdd} className="text-xs font-medium text-red hover:text-black flex items-center gap-1">
          <Plus size={12} /> Add paragraph
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <textarea
              value={item}
              onChange={(e) => onChange(i, e.target.value)}
              rows={2}
              className={`${inputClass} flex-1 resize-none`}
            />
            <button onClick={() => onRemove(i)} className="p-2 text-black/20 hover:text-red shrink-0">
              <X size={14} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-black/30 italic">No paragraphs yet.</p>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-black mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red/40 transition-all";