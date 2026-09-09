"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ImageIcon } from "lucide-react";

export type SpecRow = { label: string; value: string };

export type ProductCardProps = {
  index: number;
  brand: string;
  name: string;
  tagline: string;
  description?: string[];
  moreInfo?: string[];
  benefits?: string[];
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
  benefits,
  specs,
  imageSrc,
}: ProductCardProps) {
  const ref = useRef(null);
  const [tab, setTab] = useState<"info" | "benefits" | "specs">(
    moreInfo?.length ? "info" : benefits?.length ? "benefits" : "specs"
  );

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  const tabs: { key: "info" | "benefits" | "specs"; label: string }[] = [
    ...(moreInfo?.length ? [{ key: "info" as const, label: "Details" }] : []),
    ...(benefits?.length ? [{ key: "benefits" as const, label: "Benefits" }] : []),
    ...(specs?.length ? [{ key: "specs" as const, label: "Specifications" }] : []),
  ];

  return (
    <article ref={ref} className="border-t border-black/10 first:border-t-0">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
          {/* Number + brand rail */}
          <div className="lg:col-span-2 flex lg:flex-col items-baseline lg:items-start gap-3 lg:gap-6">
            <span className="text-6xl sm:text-7xl font-light text-black/10 tabular-nums leading-none">
              {String(index).padStart(2, "0")}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40 lg:mt-auto">
              {brand}
            </span>
          </div>

          {/* Image */}
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

          {/* Content */}
          <div className="lg:col-span-6">
            <h3 className="text-3xl sm:text-4xl font-semibold text-black leading-[1.1] tracking-tight mb-3">
              {name}
            </h3>
            <p className="text-black/50 text-[15px] mb-8">{tagline}</p>

            <div className="space-y-4 text-black/70 text-[15px] leading-relaxed mb-10 max-w-xl">
              {(description ?? []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {tabs.length > 0 && (
              <div>
                {tabs.length > 1 ? (
                  <div className="flex gap-8 border-b border-black/10 mb-7">
                    {tabs.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className="relative pb-3 text-[13px] font-medium tracking-wide"
                        style={{ color: tab === t.key ? "#1A1A1A" : "#1A1A1A55" }}
                      >
                        {t.label}
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

                  {tab === "benefits" && benefits?.length ? (
                    <motion.ul
                      key="benefits"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-x-8"
                    >
                      {benefits.map((benefit, i) => (
                        <li
                          key={i}
                          className="flex items-baseline gap-3 text-[14px] text-black/70 py-2 border-b border-black/[0.06]"
                        >
                          <span className="text-red text-[10px] tabular-nums shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {benefit}
                        </li>
                      ))}
                    </motion.ul>
                  ) : null}

                  {tab === "specs" && specs?.length ? (
                    <motion.div
                      key="specs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {specs.map((spec, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 py-3 border-b border-black/[0.06] text-[13px]"
                        >
                          <span className="text-black/45">{spec.label}</span>
                          <span className="text-black font-mono">
                            {spec.value}
                          </span>
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