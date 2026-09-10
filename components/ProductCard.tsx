"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Check, ImageIcon } from "lucide-react";

export type SpecRow = { label: string; value: string };
export type ItemGroup = { label: string; items: string[] };

export type ProductCardProps = {
  index: number;
  brand: string;
  name: string;
  tagline: string;
  description?: string[];
  moreInfo?: string[];
  groups?: ItemGroup[];
  specs?: SpecRow[];
  imageSrc?: string;
};

export default function ProductCard({
  index,
  brand,
  name,
  tagline,
  description,
  moreInfo,
  groups,
  specs,
  imageSrc,
}: ProductCardProps) {
  const ref = useRef(null);

  type TabKey = "info" | "specs" | `group-${number}`;

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    ...(moreInfo?.length ? [{ key: "info" as TabKey, label: "Details" }] : []),
    ...(groups ?? []).map((g, i) => ({
      key: `group-${i}` as TabKey,
      label: g.label,
      count: g.items.length,
    })),
    ...(specs?.length
      ? [{ key: "specs" as TabKey, label: "Specifications", count: specs.length }]
      : []),
  ];

  const [tab, setTab] = useState<TabKey>(tabs[0]?.key ?? "info");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  const activeGroup =
    tab.startsWith("group-") && groups
      ? groups[parseInt(tab.split("-")[1], 10)]
      : null;

  return (
    <article ref={ref} className="border-t border-black/10 first:border-t-0">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
          <div className="lg:col-span-2 flex lg:flex-col items-baseline lg:items-start gap-3 lg:gap-6">
            <span className="text-6xl sm:text-7xl font-light text-black/10 tabular-nums leading-none">
              {String(index).padStart(2, "0")}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40 lg:mt-auto">
              {brand}
            </span>
          </div>

          <div className="lg:col-span-4">
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
              {imageSrc ? (
                <motion.img
                  style={{ scale: imageScale }}
                  src={imageSrc}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-black/20">
                  <ImageIcon size={32} strokeWidth={1} />
                  <span className="text-[11px] tracking-wide">No image yet</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6">
            <h3 className="text-3xl sm:text-4xl font-semibold text-black leading-[1.1] tracking-tight mb-4">
              {name}
            </h3>

            <p className="text-lg text-black/70 italic leading-snug mb-6 pl-4 border-l-2 border-red/40">
              {tagline}
            </p>

            <div className="space-y-4 text-black/60 text-[15px] leading-relaxed mb-10 max-w-xl">
              {(description ?? []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {tabs.length > 0 && (
              <div>
                {tabs.length > 1 ? (
                  <div className="flex flex-wrap gap-x-7 gap-y-2 border-b border-black/10 mb-8">
                    {tabs.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className="relative pb-3 text-[13px] font-medium tracking-wide flex items-center gap-1.5 whitespace-nowrap"
                        style={{ color: tab === t.key ? "#1A1A1A" : "#1A1A1A55" }}
                      >
                        {t.label}
                        {t.count ? (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{
                              background: tab === t.key ? "#1A1A1A" : "#1A1A1A0D",
                              color: tab === t.key ? "#fff" : "#1A1A1A66",
                            }}
                          >
                            {t.count}
                          </span>
                        ) : null}
                        {tab === t.key && (
                          <motion.span
                            layoutId={`underline-${name}`}
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                            className="absolute left-0 right-0 -bottom-px h-[1.5px] bg-red"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40 mb-6">
                    {tabs[0].label}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {tab === "info" && moreInfo?.length ? (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 text-black/60 text-[14px] leading-relaxed max-w-xl"
                    >
                      {moreInfo.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </motion.div>
                  ) : null}

                  {activeGroup ? (
                    <motion.div
                      key={tab}
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0 }}
                      variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.03 } },
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {activeGroup.items.map((item, i) => (
                        <motion.div
                          key={i}
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            show: { opacity: 1, y: 0 },
                          }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 border border-black/5"
                        >
                          <span className="mt-0.5 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                            <Check size={11} strokeWidth={3} />
                          </span>
                          <span className="text-[13.5px] text-black/75 leading-snug">
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : null}

                  {tab === "specs" && specs?.length ? (
                    <motion.div
                      key="specs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-xl border border-black/10 divide-y divide-black/[0.06] overflow-hidden"
                    >
                      {specs.map((spec, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
                        >
                          <div className="px-4 py-3 text-[12px] font-medium text-black/50 uppercase tracking-wide bg-neutral-50 border-r border-black/[0.06]">
                            {spec.label}
                          </div>
                          <div className="px-4 py-3 text-[13.5px] text-black font-mono">
                            {spec.value}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}