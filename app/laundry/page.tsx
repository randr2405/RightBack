"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
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
}: {
  index: number;
  product: DbProduct;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const direction = index % 2 === 0 ? -1 : 1;

  const opacity = useTransform(scrollYProgress, [0, 0.22, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.22], [90, 0]);
  const x = useTransform(scrollYProgress, [0, 0.22], [direction * 60, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.22], [0.94, 1]);
  const rotate = useTransform(scrollYProgress, [0, 0.22], [direction * 1.5, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y, x, scale, rotate }}>
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

export default function LaundryPage() {
  const [list, setList] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  const { scrollYProgress: pageProgress } = useScroll();
  const progressScale = useSpring(pageProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.3,
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

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "laundry")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Failed to load Laundry products:", error.message);
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
        className="relative bg-[#0A0A0A] text-white overflow-hidden sm:min-h-[640px]"
      >
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0"
        >
          {/* Hero image: machine row on the right, empty black left and centre */}
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-no-repeat opacity-40 sm:opacity-100"
            style={{
              backgroundImage: "url('/hero/laundry-hero.png')",
              backgroundPosition: "right center",
            }}
          />
          {/* Slight darkening on the left so text always has contrast */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.2) 45%, transparent 70%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-neutral-100 pointer-events-none" />
        </motion.div>

        <motion.div
          style={{
            opacity: heroOpacity,
            y: heroContentY,
            scale: heroContentScale,
          }}
          className="relative px-6 pt-28 pb-24"
        >
          <div className="max-w-6xl mx-auto">
            <div className="sm:w-[52%] text-center sm:text-left">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[#DC2626] font-semibold tracking-widest uppercase text-sm mb-4"
              >
                Wash, Dye &amp; Finish
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                className="text-5xl sm:text-7xl font-bold"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.65)" }}
              >
                Laundry
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-6 max-w-2xl mx-auto sm:mx-0 text-white/70 text-lg sm:text-xl"
              >
                Advanced garment dyeing, washing, drying, and finishing
                technology built on decades of engineering expertise.
              </motion.p>

              <motion.div style={{ y: statsY }}>
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={stagger}
                  transition={{ delayChildren: 0.5 }}
                  className="mt-14 flex flex-wrap justify-center sm:justify-start gap-10 sm:gap-16"
                >
                  {[
                    { value: String(list.length), label: "Machine Lines" },
                    { value: "70%", label: "Higher Output" },
                    { value: "50%", label: "Energy Savings" },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      variants={fadeUp}
                      className="text-center sm:text-left"
                    >
                      <div className="text-4xl sm:text-5xl font-bold text-white">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-sm uppercase tracking-wider text-white/50">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-24">
        <div ref={listRef} className="relative max-w-6xl mx-auto">
          <div
            aria-hidden
            className="hidden xl:block absolute -left-8 top-0 bottom-0 w-px bg-black/10"
          >
            <motion.div
              style={{ scaleY: railScale }}
              className="w-full h-full origin-top bg-[#DC2626]"
            />
          </div>

          <div className="flex flex-col gap-16">
            {loading && (
              <p className="text-center text-black/40 py-16">
                Loading laundry machines…
              </p>
            )}

            {!loading &&
              list.map((product, i) => (
                <ScrollCard key={product.id} index={i} product={product} />
              ))}

            {!loading && list.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-black/50 py-16"
              >
                No laundry machines available right now — check back soon.
              </motion.p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}