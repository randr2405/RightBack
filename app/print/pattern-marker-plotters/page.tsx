"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

type DbProduct = {
  id: string;
  brand: string;
  name: string;
  tagline: string | null;
  description: string[];
  more_info: string[];
  groups: { label: string; items: string[] }[];
  specs: { label: string; value: string }[];
  image_url: string | null;
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
} as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
} as const;

function ScrollCard({
  index,
  product,
  reduced,
}: {
  index: number;
  product: DbProduct;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const direction = index % 2 === 0 ? -1 : 1;

  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.8, 1], [0, 1, 1, 0.35]);
  const y = useTransform(scrollYProgress, [0, 0.22, 0.8, 1], [90, 0, 0, -40]);
  const x = useTransform(scrollYProgress, [0, 0.22], [direction * 60, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.22, 0.8, 1], [0.94, 1, 1, 0.97]);
  const rotate = useTransform(scrollYProgress, [0, 0.22], [direction * 1.5, 0]);
  const blurPx = useTransform(scrollYProgress, [0, 0.18], [6, 0]);
  const filter = useTransform(blurPx, (b) => `blur(${b}px)`);
  const accent = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={
        reduced
          ? undefined
          : { opacity, y, x, scale, rotate, filter, willChange: "transform, opacity" }
      }
      className="relative"
    >
      {!reduced && (
        <motion.div
          aria-hidden
          style={{ scaleX: accent }}
          className="absolute -top-4 left-0 right-0 h-0.5 origin-left bg-[#DC2626]/70 rounded-full"
        />
      )}
      <ProductCard
        index={index + 1}
        brand={product.brand}
        name={product.name}
        tagline={product.tagline ?? ""}
        description={product.description}
        moreInfo={product.more_info}
        groups={product.groups}
        specs={product.specs}
        imageSrc={product.image_url ?? undefined}
      />
    </motion.div>
  );
}

export default function PatternMarkerPlottersPage() {
  const [list, setList] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const reduced = !!useReducedMotion();

  const heroRef = useRef(null);
  const listRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroProgress, [0, 1], [1, 0.2]);
  const heroContentY = useTransform(heroProgress, [0, 1], [0, 120]);
  const heroContentScale = useTransform(heroProgress, [0, 1], [1, 0.92]);
  const bgY = useTransform(heroProgress, [0, 1], ["0%", "20%"]);
  const bgScale = useTransform(heroProgress, [0, 1], [1, 1.2]);
  const statsY = useTransform(heroProgress, [0, 1], [0, -40]);

  const eyebrowY = useTransform(heroProgress, [0, 1], [0, -30]);
  const titleY = useTransform(heroProgress, [0, 1], [0, 60]);
  const titleTracking = useTransform(heroProgress, [0, 1], ["0em", "0.06em"]);
  const subtitleY = useTransform(heroProgress, [0, 1], [0, 90]);
  const subtitleOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);

  const { scrollYProgress: pageProgress } = useScroll();
  const progressScale = useSpring(pageProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.3,
  });

  useMotionValueEvent(pageProgress, "change", (v) => {
    setShowTop(v > 0.12);
  });

  const { scrollYProgress: listProgress } = useScroll({
    target: listRef,
    offset: ["start end", "end end"],
  });
  const railScale = useSpring(listProgress, {
    stiffness: 100,
    damping: 25,
    mass: 0.3,
  });
  const railDotTop = useTransform(railScale, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);

  const { scrollYProgress: bandProgress } = useScroll({
    target: bandRef,
    offset: ["start end", "end start"],
  });
  const bandX = useTransform(bandProgress, [0, 1], ["10%", "-35%"]);
  const bandXReverse = useTransform(bandProgress, [0, 1], ["-35%", "10%"]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "print/pattern-marker-plotters")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error(
          "Failed to load Pattern Marker Plotters products:",
          error.message
        );
      }

      if (!cancelled) {
        setList((products ?? []) as DbProduct[]);
        setLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-neutral-100 flex-1">
      <motion.div
        aria-hidden
        style={{ scaleX: progressScale }}
        className="fixed top-0 left-0 right-0 h-1 origin-left bg-[#DC2626] z-[60]"
      />

      <section
        ref={heroRef}
        className="relative bg-[#0A0A0A] text-white overflow-hidden"
      >
        <motion.div
          style={reduced ? undefined : { y: bgY, scale: bgScale }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-no-repeat bg-right bg-[length:auto_100%] opacity-40 sm:opacity-55"
            style={{
              backgroundImage: "url('/hero/pattern-marker-plotters-hero.png')",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 15%, black 65%)",
              maskImage: "linear-gradient(to right, transparent 15%, black 65%)",
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(50% 60% at 50% 45%, rgba(0,0,0,0.6), transparent 80%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#0A0A0A] pointer-events-none" />
        </motion.div>

        <motion.div
          style={
            reduced
              ? undefined
              : {
                  opacity: heroOpacity,
                  y: heroContentY,
                  scale: heroContentScale,
                }
          }
          className="relative px-6 pt-28 pb-24 text-center"
        >
          <motion.div style={reduced ? undefined : { y: eyebrowY }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-red font-semibold tracking-widest uppercase text-sm mb-4"
            >
              Print
            </motion.p>
          </motion.div>
          <motion.div
            style={reduced ? undefined : { y: titleY, letterSpacing: titleTracking }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="text-5xl sm:text-7xl font-bold"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.65)" }}
            >
              Pattern Marker Plotters
            </motion.h1>
          </motion.div>
          <motion.div
            style={reduced ? undefined : { y: subtitleY, opacity: subtitleOpacity }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 max-w-2xl mx-auto text-white/90 text-lg sm:text-xl"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.8)" }}
            >
              High-precision plotting and cutting technology for accurate,
              cost-efficient pattern marker production.
            </motion.p>
          </motion.div>

          <motion.div style={reduced ? undefined : { y: statsY }}>
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              transition={{ delayChildren: 0.5 }}
              className="mt-14 flex flex-wrap justify-center gap-10 sm:gap-16"
            >
              {[
                { value: String(list.length), label: "Systems" },
                { value: "H9", label: "Series" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  className="text-center"
                >
                  <div className="text-4xl sm:text-5xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm uppercase tracking-wider text-white/80">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <div
        ref={bandRef}
        aria-hidden
        className="overflow-hidden bg-[#0A0A0A] py-6 select-none"
      >
        <motion.div
          style={reduced ? undefined : { x: bandX }}
          className="whitespace-nowrap text-4xl sm:text-6xl font-bold uppercase text-white/10"
        >
          Plot • Cut • Precision • Plot • Cut • Precision • Plot • Cut • Precision
        </motion.div>
        <motion.div
          style={reduced ? undefined : { x: bandXReverse }}
          className="whitespace-nowrap text-4xl sm:text-6xl font-bold uppercase text-[#DC2626]/40"
        >
          H9 Series • Accurate • Efficient • H9 Series • Accurate • Efficient
        </motion.div>
      </div>

      <section className="px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-6xl mx-auto mb-16 text-center"
        >
          <p className="text-[#DC2626] font-semibold tracking-widest uppercase text-sm mb-3">
            The Range
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-black">
            Choose your plotter
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-5 h-0.5 w-24 origin-center bg-[#DC2626]"
          />
        </motion.div>

        <div ref={listRef} className="relative max-w-6xl mx-auto">
          <div
            aria-hidden
            className="hidden xl:block absolute -left-8 top-0 bottom-0 w-px bg-black/10"
          >
            <motion.div
              style={{ scaleY: railScale }}
              className="w-full h-full origin-top bg-[#DC2626]"
            />
            <motion.div
              style={{ top: railDotTop }}
              className="absolute -left-[3px] w-[7px] h-[7px] -translate-y-1/2 rounded-full bg-[#DC2626] shadow-[0_0_10px_2px_rgba(220,38,38,0.6)]"
            />
          </div>

          <div className="flex flex-col gap-16">
            {loading && (
              <p className="text-center text-black/40 py-16">
                Loading pattern marker plotters…
              </p>
            )}

            {!loading &&
              list.map((product, i) => (
                <ScrollCard
                  key={product.id}
                  index={i}
                  product={product}
                  reduced={reduced}
                />
              ))}

            {!loading && list.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-black/50 py-16"
              >
                No pattern marker plotters available right now — check back
                soon.
              </motion.p>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showTop && (
          <motion.button
            key="back-to-top"
            type="button"
            aria-label="Back to top"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-[60] h-11 w-11 rounded-full bg-[#DC2626] text-white shadow-lg flex items-center justify-center"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}