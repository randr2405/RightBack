"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ImageIcon, Search, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { sections, categoryInfo, categoryPath, sectionForCategory } from "@/lib/catalogue";

type DbProduct = {
  id: string;
  category: string;
  brand: string;
  name: string;
  tagline: string | null;
  description: string[] | null;
  more_info: string[] | null;
  groups: { label: string; items: string[] }[] | null;
  image_url: string | null;
  tags?: string[] | null;
};

type SearchRecord = DbProduct & {
  sectionLabel: string;
  categoryLabel: string;
  tagText: string;
  descriptionText: string;
  featureText: string;
};

type View = "categories" | "all";

const QUICK_SEARCHES = ["Denim", "Shirts", "Cutting", "DTF", "Laser", "Pockets", "Dyeing"];

function toRecord(p: DbProduct): SearchRecord {
  const info = categoryInfo(p.category);
  return {
    ...p,
    sectionLabel: info.section,
    categoryLabel: info.label,
    tagText: (p.tags ?? []).join(" "),
    descriptionText: (p.description ?? []).join(" "),
    featureText: [
      ...(p.more_info ?? []),
      ...(p.groups ?? []).flatMap((g) => [g.label, ...g.items]),
    ].join(" "),
  };
}

function ProductResult({ product }: { product: SearchRecord }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link
        href={`/${product.category}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
      >
        <div className="relative aspect-[4/3] bg-white">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain p-3"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-black/20">
              <ImageIcon size={30} strokeWidth={1} />
              <span className="text-[11px] tracking-wide">No image yet</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col border-t border-black/[0.06] p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-red/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-red">
              {product.sectionLabel}
            </span>
            {product.categoryLabel && product.categoryLabel !== product.sectionLabel && (
              <span className="rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/50">
                {product.categoryLabel}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold leading-snug text-black">{product.name}</h3>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">
            {product.brand}
          </p>
          {product.tagline && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/60">{product.tagline}</p>
          )}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-red">
            View details
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function SolutionsExplorer() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [view, setView] = useState<View>("categories");
  const [products, setProducts] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("Failed to load products:", error.message);
        setFailed(true);
      } else {
        setProducts(((data ?? []) as DbProduct[]).map(toRecord));
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const trimmed = query.trim();
    if (trimmed) {
      url.searchParams.set("q", trimmed);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState(null, "", url.toString());
  }, [query]);

  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: [
          { name: "name", weight: 0.3 },
          { name: "tagText", weight: 0.25 },
          { name: "categoryLabel", weight: 0.1 },
          { name: "sectionLabel", weight: 0.1 },
          { name: "brand", weight: 0.1 },
          { name: "tagline", weight: 0.1 },
          { name: "descriptionText", weight: 0.03 },
          { name: "featureText", weight: 0.02 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [products]
  );

  const trimmed = query.trim();
  const searching = trimmed.length > 0;

  const results = useMemo(
    () => (searching ? fuse.search(trimmed).map((r) => r.item) : []),
    [fuse, searching, trimmed]
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
    return map;
  }, [products]);

  const productsBySection = useMemo(
    () =>
      sections.map((s) => ({
        section: s,
        items: products.filter((p) => sectionForCategory(p.category)?.href === s.href),
      })),
    [products]
  );

  return (
    <div className="flex-1 bg-neutral-100">
      <section className="relative overflow-hidden bg-[#0A0A0A] px-6 pb-28 pt-24 text-center text-white sm:pb-36">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 70% at 50% 0%, rgba(220,38,38,0.28), transparent 70%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-neutral-100" />

        <div className="relative mx-auto max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-red"
          >
            Our Solutions
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-4xl font-bold sm:text-6xl"
          >
            Find the right machine
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-5 text-lg text-white/80 sm:text-xl"
          >
            Search by machine, brand or what you make, or browse by category.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="relative">
              <Search
                size={20}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-black/40"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search machines, e.g. towel, jeans, pocket, laser…"
                aria-label="Search machines"
                autoFocus
                className="w-full rounded-full border border-transparent bg-white py-4 pl-14 pr-14 text-base text-black shadow-2xl outline-none placeholder:text-black/40 focus:border-red"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/5 text-black/60 hover:bg-black/10"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {QUICK_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-red hover:bg-red hover:text-white"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28 pt-6">
        {loading && <p className="py-20 text-center text-black/40">Loading solutions…</p>}

        {!loading && failed && (
          <p className="py-20 text-center text-black/50">
            We couldn&apos;t load the product list right now. Please refresh, or{" "}
            <Link href="/contact" className="text-red underline">
              contact us
            </Link>
            .
          </p>
        )}

        {!loading && !failed && searching && (
          <div>
            <p className="mb-8 text-sm text-black/60">
              {results.length === 0
                ? `No machines found for “${trimmed}”`
                : `${results.length} ${results.length === 1 ? "machine" : "machines"} found for “${trimmed}”`}
            </p>

            {results.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {results.map((p) => (
                    <ProductResult key={p.id} product={p} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="mx-auto max-w-xl rounded-3xl bg-white px-8 py-14 text-center shadow-sm">
                <h2 className="text-2xl font-bold text-black">Can&apos;t find what you&apos;re looking for?</h2>
                <p className="mt-3 text-black/60">
                  We supply more than what is listed online. Tell us what you&apos;re producing and our
                  team will recommend the right equipment.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/contact"
                    className="rounded-full bg-red px-8 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
                  >
                    Contact us
                  </Link>
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="rounded-full border border-black/15 px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-black/5"
                  >
                    Browse categories
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !failed && !searching && (
          <div>
            <div className="mb-10 flex justify-center">
              <div className="inline-flex rounded-full bg-white p-1 shadow-sm">
                {(
                  [
                    { key: "categories", label: "Browse by category" },
                    { key: "all", label: `All machines${products.length ? ` (${products.length})` : ""}` },
                  ] as { key: View; label: string }[]
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setView(tab.key)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                      view === tab.key ? "bg-[#1A1A1A] text-white" : "text-black/60 hover:text-black"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {view === "categories" && (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
              >
                {sections.map((s) => {
                  const base = categoryPath(s.href);
                  let total = 0;
                  counts.forEach((n, cat) => {
                    if (cat === base || cat.startsWith(`${base}/`)) total += n;
                  });

                  return (
                    <motion.div
                      key={s.href}
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                      }}
                      className="rounded-3xl bg-white p-6 shadow-sm"
                    >
                      <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-black/[0.06] pb-4">
                        <h2 className="text-xl font-bold text-black">{s.label}</h2>
                        <span className="text-xs font-medium uppercase tracking-wider text-black/40">
                          {total} {total === 1 ? "machine" : "machines"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {s.links.map((link) => {
                          const n = counts.get(categoryPath(link.href));
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-neutral-50"
                            >
                              <span className="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 rounded-full bg-red transition-all duration-200 group-hover:h-8" />
                              <div className="min-w-0 flex-1 pl-2">
                                <div className="text-sm font-semibold text-black">{link.label}</div>
                                {link.desc && (
                                  <div className="mt-0.5 text-xs text-black/45">{link.desc}</div>
                                )}
                              </div>
                              {typeof n === "number" && (
                                <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium text-black/50">
                                  {n}
                                </span>
                              )}
                              <ArrowRight
                                size={14}
                                className="shrink-0 text-black/20 transition-all group-hover:translate-x-0.5 group-hover:text-red"
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {view === "all" && (
              <div className="flex flex-col gap-16">
                {productsBySection
                  .filter((g) => g.items.length > 0)
                  .map((g) => (
                    <div key={g.section.href}>
                      <div className="mb-6 flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-black">{g.section.label}</h2>
                        <div className="h-px flex-1 bg-black/10" />
                        <Link
                          href={g.section.href}
                          className="text-sm font-medium text-red hover:underline"
                        >
                          View {g.section.label} →
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {g.items.map((p) => (
                          <ProductResult key={p.id} product={p} />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}