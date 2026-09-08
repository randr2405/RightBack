"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ImageIcon } from "lucide-react";

export type ProductCardProps = {
  brand: string;
  name: string;
  tagline: string;
  description: string[];
  moreInfo?: string[];
  benefits?: string[];
  imageSrc?: string;
  reverse?: boolean;
};

export default function ProductCard({
  brand,
  name,
  tagline,
  description,
  moreInfo,
  benefits,
  imageSrc,
  reverse = false,
}: ProductCardProps) {
  const [activeTab, setActiveTab] = useState<"info" | "benefits">("info");
  const hasTabs = !!(moreInfo?.length || benefits?.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-black/5 overflow-hidden transition-shadow duration-500"
    >
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${
          reverse ? "lg:[direction:rtl]" : ""
        }`}
      >
        {/* Image side */}
        <div className="relative bg-neutral-100 flex items-center justify-center p-10 min-h-[320px] [direction:ltr]">
          <motion.div
            whileHover={{ scale: 1.05, rotate: reverse ? -1 : 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red/10 via-transparent to-black/5 rounded-2xl" />
            {imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt={name}
                className="relative max-h-64 object-contain drop-shadow-xl"
              />
            ) : (
              <div className="relative flex flex-col items-center gap-2 text-black/30">
                <ImageIcon size={48} strokeWidth={1.2} />
                <span className="text-xs">Image coming soon</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Content side */}
        <div className="p-8 sm:p-12 flex flex-col justify-center [direction:ltr]">
          <span className="text-red text-xs font-semibold uppercase tracking-widest mb-2">
            {brand}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-black mb-4">
            {name}
          </h3>
          <p className="text-black font-medium mb-4">{tagline}</p>

          <div className="space-y-3 text-black/70 text-sm leading-relaxed mb-6">
            {description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {hasTabs && (
            <div>
              <div className="flex gap-6 border-b border-black/10 mb-5 relative">
                {moreInfo?.length ? (
                  <button
                    onClick={() => setActiveTab("info")}
                    className={`pb-3 text-sm font-medium transition-colors relative ${
                      activeTab === "info" ? "text-black" : "text-black/40"
                    }`}
                  >
                    More Information
                    {activeTab === "info" && (
                      <motion.div
                        layoutId={`underline-${name}`}
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red"
                      />
                    )}
                  </button>
                ) : null}
                {benefits?.length ? (
                  <button
                    onClick={() => setActiveTab("benefits")}
                    className={`pb-3 text-sm font-medium transition-colors relative ${
                      activeTab === "benefits" ? "text-black" : "text-black/40"
                    }`}
                  >
                    Main Benefits
                    {activeTab === "benefits" && (
                      <motion.div
                        layoutId={`underline-${name}`}
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red"
                      />
                    )}
                  </button>
                ) : null}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "info" && moreInfo?.length ? (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3 text-black/70 text-sm leading-relaxed"
                  >
                    {moreInfo.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </motion.div>
                ) : null}

                {activeTab === "benefits" && benefits?.length ? (
                  <motion.ul
                    key="benefits"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {benefits.map((benefit, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-start gap-2 text-sm text-black/70"
                      >
                        <CheckCircle2
                          size={16}
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
    </motion.div>
  );
}