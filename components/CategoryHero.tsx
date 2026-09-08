"use client";

import { motion } from "framer-motion";

export default function CategoryHero({
  eyebrow,
  title,
  ghostWord,
  description,
  stats,
}: {
  eyebrow: string;
  title: string;
  ghostWord: string;
  description: string;
  stats: { label: string; value: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-cream pt-32 pb-24">
      {/* Diagonal red block */}
      <div
        className="absolute top-0 right-0 w-2/3 h-full bg-red/5"
        style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)" }}
      />
      <motion.div
        className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-red/10 to-transparent"
        style={{ clipPath: "polygon(45% 0, 100% 0, 100% 100%, 15% 100%)" }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Giant outlined ghost word in background */}
      <div className="absolute inset-0 flex items-center justify-end pr-6 pointer-events-none select-none overflow-hidden">
        <span
          className="text-[10rem] sm:text-[16rem] font-black leading-none whitespace-nowrap"
          style={{
            WebkitTextStroke: "1.5px rgba(0,0,0,0.08)",
            color: "transparent",
          }}
        >
          {ghostWord}
        </span>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
          {eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold text-black leading-[0.95] tracking-tight max-w-3xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-lg text-black/60 text-lg leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Floating glass stat cards */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } } }}
          className="flex flex-wrap gap-4 mt-12"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              whileHover={{ y: -4 }}
              className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl px-6 py-4 shadow-lg shadow-black/5"
            >
              <div className="text-2xl font-bold text-black">{stat.value}</div>
              <div className="text-xs text-black/50 uppercase tracking-wide mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}