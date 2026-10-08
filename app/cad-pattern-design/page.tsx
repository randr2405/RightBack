"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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

export default function CADPatternDesignPage() {
  const [list, setList] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  const heroOpacity = useTransform(smoothProgress, [0, 1], [1, 0.1]);
  const heroContentY = useTransform(smoothProgress, [0, 1], [0, 160]);
  const heroScale = useTransform(smoothProgress, [0, 1], [1, 1.12]);
  const heroBlur = useTransform(smoothProgress, [0, 1], [0, 8]);
  const heroFilter = useTransform(heroBlur, (v) => `blur(${v}px)`);
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.25]);
  const eyebrowX = useTransform(smoothProgress, [0, 1], [0, -60]);
  const statsY = useTransform(smoothProgress, [0, 1], [0, 220]);
  const statsOpacity = useTransform(smoothProgress, [0, 0.6], [1, 0]);
  const scrollHintOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "cad-pattern-design")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Failed to load CAD Pattern Design products:", error.message);
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
      <section ref={heroRef} className="relative bg-[#0A0A0A] text-white overflow-hidden h-[130vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0">
            {/* Hero image: workstation along the bottom, empty black above */}
            <div
              aria-hidden
              className="absolute inset-0 bg-cover bg-no-repeat opacity-50 sm:opacity-100"
              style={{
                backgroundImage: "url('/hero/cad-pattern-design-hero.png')",
                backgroundPosition: "center bottom",
              }}
            />
            {/* Soft dark centre so the subtitle stays readable near the monitor glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(50% 45% at 50% 42%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 60%, transparent 85%)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          <motion.div
            style={{ opacity: heroOpacity, y: heroContentY, scale: heroScale, filter: heroFilter }}
            className="relative h-full flex flex-col items-center justify-center px-6 pb-32 sm:pb-40 text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ x: eyebrowX }}
              className="text-[#DC2626] font-semibold tracking-widest uppercase text-sm mb-4"
            >
              Digital Design &amp; Cutting
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="text-5xl sm:text-7xl font-bold"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.65)" }}
            >
              CAD Pattern Design
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 max-w-2xl mx-auto text-white/70 text-lg sm:text-xl"
            >
              A complete digital suite for pattern making, digitization, marker planning, and precision cutting — from design to production.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              transition={{ delayChildren: 0.5 }}
              style={{ y: statsY, opacity: statsOpacity }}
              className="mt-14 flex flex-wrap justify-center gap-10 sm:gap-16"
            >
              {[
                { value: String(list.length), label: "Software Tools" },
                { value: "60%", label: "Faster Development" },
                { value: "30%", label: "Material Savings" },
              ].map((stat) => (
                <motion.div key={stat.label} variants={fadeUp} className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-white">{stat.value}</div>
                  <div className="mt-1 text-sm uppercase tracking-wider text-white/50">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            style={{ opacity: scrollHintOpacity }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent"
            />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
          </motion.div>
        </div>

        {/* Fade into the page, at the real bottom of the 130vh section so the desk stays visible on load */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-neutral-100 pointer-events-none" />
      </section>

      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          {loading && <p className="text-center text-black/40 py-16">Loading CAD pattern design tools…</p>}

          {!loading &&
            list.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 90, scale: 0.95, rotateX: 4 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                style={{ transformPerspective: 1200 }}
              >
                <ProductCard
                  index={i + 1}
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
            ))}

          {!loading && list.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-black/50 py-16">
              No CAD pattern design tools available right now — check back soon.
            </motion.p>
          )}
        </div>
      </section>
    </div>
  );
}