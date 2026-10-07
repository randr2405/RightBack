"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Check, ImageIcon, Maximize2, X } from "lucide-react";

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
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [zoomed]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.02, 1, 1.02]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  const activeGroup =
    tab.startsWith("group-") && groups
      ? groups[parseInt(tab.split("-")[1], 10)]
      : null;

  const isReversed = index % 2 === 0;

  return (
    <article ref={ref} className="relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 sm:py-20">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 items-center ${
            isReversed ? "lg:[direction:rtl]" : ""
          }`}
        >
          <div
            className={`lg:col-span-7 [direction:ltr] ${
              isReversed ? "lg:order-2" : ""
            }`}
          >
            <div className="relative">
              <span className="absolute -top-8 -left-2 text-8xl sm:text-9xl font-black text-black/[0.04] tabular-nums leading-none select-none pointer-events-none">
                {String(index).padStart(2, "0")}
              </span>

              <div className="relative rounded-3xl bg-white border border-red-600/25 shadow-[0_0_24px_-4px_rgba(220,38,38,0.35),0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  {imageSrc ? (
                    <>
                      <motion.img
                        style={{ scale: imageScale, y: imageY }}
                        src={imageSrc}
                        alt={name}
                        loading="lazy"
                        decoding="async"
                        onClick={() => setZoomed(true)}
                        className="w-full h-full object-contain p-2 sm:p-3 cursor-zoom-in"
                      />
                      <button
                        type="button"
                        onClick={() => setZoomed(true)}
                        aria-label={`View ${name} larger`}
                        className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 hover:bg-black text-white text-[12px] font-medium px-3 py-1.5 backdrop-blur transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                      >
                        <Maximize2 size={13} strokeWidth={2} />
                        Enlarge
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-black/20">
                      <ImageIcon size={32} strokeWidth={1} />
                      <span className="text-[11px] tracking-wide">No image yet</span>
                    </div>
                  )}
                </div>
                <div className="px-5 py-3 border-t border-black/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
                    {brand}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red">
                    {String(index).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`lg:col-span-5 [direction:ltr] ${isReversed ? "lg:order-1" : ""}`}>
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
                  <div className="inline-flex items-center gap-1.5 mb-8">
                    <span className="relative pb-3 text-[13px] font-medium tracking-wide text-black">
                      {tabs[0].label}
                      <span className="absolute left-0 right-0 -bottom-px h-[1.5px] bg-red" />
                    </span>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {tab === "info" && moreInfo?.length ? (
                    <motion.div
                      key="info"
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0 }}
                      variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.05 } },
                      }}
                      className="space-y-4 text-black/60 text-[14px] leading-relaxed max-w-xl"
                    >
                      {moreInfo.map((para, i) => (
                        <motion.p
                          key={i}
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            show: { opacity: 1, y: 0 },
                          }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {para}
                        </motion.p>
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
                      className="grid grid-cols-1 xl:grid-cols-2 gap-3"
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

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="border-t border-black/[0.06]" />
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {zoomed && imageSrc ? (
                <motion.div
                  key="zoom"
                  role="dialog"
                  aria-modal="true"
                  aria-label={`${name} image`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setZoomed(false)}
                  className="fixed inset-0 z-[1000] bg-black/95 cursor-zoom-out"
                  style={{ height: "100dvh", width: "100vw" }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomed(false);
                    }}
                    aria-label="Close image"
                    className="absolute z-10 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white flex items-center justify-center backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    style={{
                      top: "max(1rem, env(safe-area-inset-top))",
                      right: "max(1rem, env(safe-area-inset-right))",
                    }}
                  >
                    <X size={24} />
                  </button>
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      paddingTop: "max(4.5rem, env(safe-area-inset-top))",
                      paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
                      paddingLeft: "max(0.5rem, env(safe-area-inset-left))",
                      paddingRight: "max(0.5rem, env(safe-area-inset-right))",
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt={name}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full h-full object-contain cursor-default select-none"
                      style={{ touchAction: "pinch-zoom" }}
                      draggable={false}
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </article>
  );
}