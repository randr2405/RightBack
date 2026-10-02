"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export type PublicBanner = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link_url: string;
  cta_label: string;
};

const ROTATE_MS = 6000;

function BannerCta({ href, label }: { href: string; label: string }) {
  const className =
    "inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red text-white text-sm font-medium hover:bg-red/90 hover:scale-105 transition-all duration-300";
  const content = (
    <>
      {label}
      <ArrowRight size={14} />
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  );
}

export default function BannerCarousel({ banners }: { banners: PublicBanner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = banners.length;
  const safeIndex = index >= count ? 0 : index;
  const current = banners[safeIndex];

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(timer);
  }, [count, paused]);

  function go(delta: number) {
    setIndex((i) => (i + delta + count) % count);
  }

  return (
    <section className="w-full px-4 sm:px-6 pt-4 pb-12">
      <div
        className="relative max-w-6xl mx-auto h-[240px] sm:h-[300px] rounded-2xl overflow-hidden bg-black"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {current.image_url && (
              <img
                src={current.image_url}
                alt={current.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-center gap-3 px-6 sm:px-12 max-w-2xl">
              <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                {current.title}
              </h2>
              {current.description && (
                <p className="text-sm sm:text-base text-white/80 line-clamp-3">
                  {current.description}
                </p>
              )}
              {current.link_url && (
                <div className="pt-1">
                  <BannerCta
                    href={current.link_url}
                    label={current.cta_label || "Learn more"}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next banner"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur transition-colors"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to banner ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === safeIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}