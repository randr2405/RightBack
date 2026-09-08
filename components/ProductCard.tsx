"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { CheckCircle2, ImageIcon } from "lucide-react";

export type ProductCardProps = {
  index: number;
  brand: string;
  name: string;
  tagline: string;
  description?: string[];
  moreInfo?: string[];
  benefits?: string[];
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
  imageSrc,
}: ProductCardProps) {
  const ref = useRef(null);
  const [tab, setTab] = useState<"info" | "benefits">(
    moreInfo?.length ? "info" : "benefits"
  );

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const tabs: { key: "info" | "benefits"; label: string }[] = [
    ...(moreInfo?.length ? [{ key: "info" as const, label: "More Information" }] : []),
    ...(benefits?.length ? [{ key: "benefits" as const, label: "Main Benefits" }] : []),
  ];

  return (
    <div ref={ref} className="relative py-16 sm:py-20 px-6">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="max-w-6xl mx-auto rounded-[2rem] p-[1px] bg-gradient-to-br from-black/10 via-black/5 to-red/20 shadow-2xl shadow-black/10"
      >
        <div className="rounded-[2rem] bg-white overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Image panel — always left, dark-tinted background */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 relative bg-neutral-900 min-h-[320px] flex items-center justify-center overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <span className="text-red text-xs font-bold">
                  {String(index).padStart(2, "0")}
                </span>
                <span className="text-white/40 text-xs">/</span>
                <span className="text-white/60 text-xs uppercase tracking-wider">
                  {brand}
                </span>
              </div>
              <motion.div
                className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-red/20 blur-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                style={{ y: imageY }}
                className="relative w-full h-full flex items-center justify-center p-10"
              >
                {imageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageSrc}
                    alt={name}
                    className="max-h-64 max-w-full object-contain drop-shadow-2xl"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white/25">
                    <ImageIcon size={40} strokeWidth={1.2} />
                    <span className="text-xs">Image coming soon</span>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Content panel — always right */}
            <div className="lg:col-span-7 p-8 sm:p-12">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-2xl sm:text-3xl font-bold text-black leading-tight mb-3"
              >
                {name}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-black/80 font-medium mb-4"
              >
                {tagline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-3 text-black/60 text-sm leading-relaxed mb-8"
              >
                {(description ?? []).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </motion.div>

              {tabs.length > 0 && (
                <div>
                  {tabs.length > 1 && (
                    <div className="relative inline-flex bg-neutral-100 rounded-full p-1 mb-6">
                      {tabs.map((t) => (
                        <button
                          key={t.key}
                          onClick={() => setTab(t.key)}
                          className="relative px-5 py-2 text-xs font-semibold rounded-full z-10 transition-colors"
                          style={{ color: tab === t.key ? "#fff" : "#1A1A1A99" }}
                        >
                          {tab === t.key && (
                            <motion.div
                              layoutId={`pill-${name}`}
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              className="absolute inset-0 bg-black rounded-full -z-10"
                            />
                          )}
                          {t.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {tabs.length === 1 && (
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                        {tabs[0].label}
                      </h4>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {tab === "info" && moreInfo?.length ? (
                      <motion.div
                        key="info"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-3 text-black/60 text-sm leading-relaxed"
                      >
                        {moreInfo.map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </motion.div>
                    ) : null}

                    {tab === "benefits" && benefits?.length ? (
                      <motion.ul
                        key="benefits"
                        initial="hidden"
                        animate="show"
                        exit={{ opacity: 0, y: -8 }}
                        variants={{
                          hidden: {},
                          show: { transition: { staggerChildren: 0.04 } },
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2"
                      >
                        {benefits.map((benefit, i) => (
                          <motion.li
                            key={i}
                            variants={{
                              hidden: { opacity: 0, x: -8 },
                              show: { opacity: 1, x: 0 },
                            }}
                            className="flex items-start gap-2 text-sm text-black/70"
                          >
                            <CheckCircle2
                              size={15}
                              className="text-red mt-0.5 shrink-0"
                            />
                            {benefit}
                          </motion.li>
                        ))}
                      </motion.ul>
                    ) : null}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}