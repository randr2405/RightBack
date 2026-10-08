"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

export default function LaserMachinesPage() {
  const [list, setList] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "laser-machines")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Failed to load Laser Machines products:", error.message);
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
      <section ref={heroRef} className="relative bg-[#0A0A0A] text-white overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          {/* Hero image: laser head and denim on the left, empty black centre and right */}
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-no-repeat opacity-40 sm:opacity-100"
            style={{
              backgroundImage: "url('/hero/laser-machines-hero.png')",
              backgroundPosition: "left top",
            }}
          />
          {/* Slight darkening on the right so text always has contrast */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.2) 45%, transparent 75%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroContentY }}
          className="relative px-6 pt-28 pb-24 sm:min-h-[max(640px,52vw)] sm:flex sm:items-center"
        >
          <div className="w-full max-w-6xl mx-auto">
            <div className="sm:ml-auto sm:w-[55%] text-center sm:text-left">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[#DC2626] font-semibold tracking-widest uppercase text-sm mb-4"
              >
                Precision Finishing
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                className="text-5xl sm:text-7xl font-bold"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.65)" }}
              >
                Laser Machines
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-6 max-w-2xl mx-auto sm:mx-0 text-white/70 text-lg sm:text-xl"
              >
                Modern laser marking, finishing, and cutting technology for denim, garments, and sublimation fabrics.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="show"
                variants={stagger}
                transition={{ delayChildren: 0.5 }}
                className="mt-14 flex flex-wrap justify-center sm:justify-start gap-10 sm:gap-16"
              >
                {[
                  { value: String(list.length), label: "Systems" },
                  { value: "2", label: "Global Brands" },
                  { value: "4x", label: "Productivity Gain" },
                ].map((stat) => (
                  <motion.div key={stat.label} variants={fadeUp} className="text-center sm:text-left">
                    <div className="text-4xl sm:text-5xl font-bold text-white">{stat.value}</div>
                    <div className="mt-1 text-sm uppercase tracking-wider text-white/50">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Short fade into the page; kept low so the laser contact point stays visible */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-neutral-100 pointer-events-none" />
      </section>

      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          {loading && (
            <p className="text-center text-black/40 py-16">Loading laser machines…</p>
          )}

          {!loading &&
            list.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 80, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-black/50 py-16"
            >
              No laser machines available right now — check back soon.
            </motion.p>
          )}
        </div>
      </section>
    </div>
  );
}