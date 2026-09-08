"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ImageIcon, Plus } from "lucide-react";

export type ProductCardProps = {
  index: number;
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
  index,
  brand,
  name,
  tagline,
  description,
  moreInfo,
  benefits,
  imageSrc,
  reverse = false,
}: ProductCardProps) {
  const ref = useRef(null);
  const [showInfo, setShowInfo] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const numberX = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? ["5%", "-5%"] : ["-5%", "5%"]
  );

  return (
    <div
      ref={ref}
      className="relative py-20 sm:py-28 border-b border-black/10 last:border-b-0"
    >
      {/* Giant background index number */}
      <motion.div
        style={{ x: numberX }}
        className={`pointer-events-none select-none absolute top-0 ${
          reverse ? "right-0 sm:-right-4" : "left-0 sm:-left-4"
        } text-[8rem] sm:text-[14rem] font-black leading-none text-black/[0.04]`}
      >
        {String(index).padStart(2, "0")}
      </motion.div>

      <div
        className={`relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center px-6 ${
          reverse ? "lg:[direction:rtl]" : ""
        }`}
      >
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-5 [direction:ltr]"
        >
          <div className="relative aspect-[4/3] rounded-3xl bg-gradient-to-br from-white to-neutral-200 border border-black/5 shadow-xl overflow-hidden flex items-center justify-center">
            <motion.div
              style={{ y: imageY }}
              className="absolute inset-0 flex items-center justify-center p-10"
            >
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt={name}
                  className="max-h-full max-w-full object-contain drop-shadow-2xl"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-black/25">
                  <ImageIcon size={40} strokeWidth={1.2} />
                  <span className="text-xs">Image coming soon</span>
                </div>
              )}
            </motion.div>
            <motion.div
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-red/20 blur-2xl"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Content */}
        <div className="lg:col-span-7 [direction:ltr]">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-red text-xs font-bold uppercase tracking-[0.2em] mb-3"
          >
            {brand}
          </motion.span>

          <motion.h3
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-[1.1] mb-5"
          >
            {name}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-black/80 font-medium mb-4"
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-3 text-black/60 text-sm leading-relaxed mb-6 max-w-xl"
          >
            {description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </motion.div>

          {benefits?.length ? (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {benefits.map((benefit, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, y: 10 },
                    show: { opacity: 1, scale: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: "#1A1A1A", color: "#fff" }}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-black/10 text-xs font-medium text-black/70 cursor-default transition-colors"
                >
                  {benefit}
                </motion.span>
              ))}
            </motion.div>
          ) : null}

          {moreInfo?.length ? (
            <div>
              <motion.button
                onClick={() => setShowInfo((v) => !v)}
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 text-sm font-semibold text-black group"
              >
                <motion.span
                  animate={{ rotate: showInfo ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-7 h-7 rounded-full bg-red text-white flex items-center justify-center"
                >
                  <Plus size={14} />
                </motion.span>
                {showInfo ? "Show less" : "Read full details"}
              </motion.button>

              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-5 space-y-3 text-black/60 text-sm leading-relaxed max-w-xl border-t border-black/10 mt-5">
                      {moreInfo.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}