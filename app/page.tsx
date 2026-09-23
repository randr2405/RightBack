"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Footer from "@/components/Footer";
import AnimatedCounter from "@/components/AnimatedCounter";

const whatWeDo = [
  {
    index: "01",
    title: "Sewing & Automation",
    description:
      "High-performance sewing machines and engineered workstations built for speed, precision, and consistency.",
  },
  {
    index: "02",
    title: "Cutting & CAD Solutions",
    description:
      "CNC cutting and pattern design systems that improve accuracy, reduce waste, and speed up production.",
  },
  {
    index: "03",
    title: "Printing, Finishing & Laser",
    description:
      "Modern printing and laser finishing technologies that deliver premium results with lower water, energy, and labour usage.",
  },
  {
    index: "04",
    title: "Laundry & Garment Dyeing",
    description:
      "Efficient and sustainable laundry and dyeing systems that enhance garment quality while reducing resource consumption.",
  },
];

const whyChoose = [
  {
    title: "Global Technology, Local Expertise",
    description:
      "We partner with leading international manufacturers and combine that with on-the-ground industry knowledge.",
  },
  {
    title: "Production-Proven Equipment",
    description:
      "Every machine we supply is selected for reliability, performance, and long-term value.",
  },
  {
    title: "End-to-End Support",
    description:
      "From consultation and installation to training and after-sales service, we support you at every stage.",
  },
  {
    title: "Built for Modern Manufacturing",
    description:
      "Many of our systems are Industry 4.0 ready, enabling smarter production, monitoring, and data-driven decision-making.",
  },
];

const industries = [
  "Apparel & fashion manufacturing",
  "Denim & jeans production",
  "Workwear & uniforms",
  "Sportswear & performance garments",
  "Industrial & technical textiles",
];

const stats = [
  { value: 20, suffix: "+", label: "Years experience" },
  { value: 500, suffix: "+", label: "Machines installed" },
  { value: 50, suffix: "+", label: "Factories served" },
  { value: 100, suffix: "%", label: "Support commitment" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
} as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
} as const;

/** Infinite horizontal marquee — used for the industries strip. */
function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/15 py-5">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-10 text-lg sm:text-2xl font-semibold text-white/80"
          >
            {item}
            <span className="text-red">✕</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);
  const panelSkew = useTransform(scrollYProgress, [0, 1], [0, 6]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-neutral-100">
      {/* Hero — oversized type on black, diagonal red panel */}
      <section ref={heroRef} className="relative bg-black text-white overflow-hidden">
        <motion.div
          style={{ skewY: panelSkew }}
          className="absolute -right-1/4 -top-1/3 w-[90%] h-[160%] bg-red origin-top-right"
        />
        <motion.div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative px-6 pt-32 pb-20 sm:pt-44 sm:pb-28"
        >
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={fadeUp}
              className="font-mono text-xs sm:text-sm text-white/50 mb-8 tracking-wide"
            >
              RIGHTBACK / GARMENT MANUFACTURING EQUIPMENT
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-black leading-[0.88] tracking-tight text-[15vw] sm:text-[9rem] lg:text-[10.5rem]"
            >
              GARMENT
              <br />
              TECH<span className="text-red">.</span>
            </motion.h1>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-8 items-end max-w-5xl">
              <motion.p
                variants={fadeUp}
                className="text-xl sm:text-3xl font-medium text-white/85 max-w-xl"
              >
                Precision machinery. Smarter production.
                <br />
                Reliable performance.
              </motion.p>

              <motion.div variants={fadeUp}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 px-9 py-5 bg-white text-black text-lg font-semibold hover:bg-red hover:text-white transition-colors duration-300"
                >
                  Explore our solutions →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <Marquee items={industries} />
      </section>

      {/* Intro — huge watermark numeral behind the pull quote */}
      <section className="relative bg-neutral-100 px-6 py-28 sm:py-36 overflow-hidden">
        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 text-[40vw] sm:text-[24rem] font-black leading-none text-black/[0.04] select-none">
          20+
        </span>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="relative max-w-3xl mx-auto text-black text-3xl sm:text-5xl font-bold leading-tight tracking-tight text-center"
        >
          We supply world-class apparel manufacturing technology to
          factories across Southern Africa —{" "}
          <span className="text-red">without compromise.</span>
        </motion.p>
      </section>

      {/* Stats — asymmetric black/red blocks */}
      <section className="grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`px-6 py-16 sm:py-20 flex flex-col justify-end ${
              i % 2 === 0 ? "bg-black text-white" : "bg-red text-white"
            }`}
          >
            <div className="font-black text-5xl sm:text-6xl leading-none">
              <AnimatedCounter value={s.value} suffix={s.suffix} label="" />
            </div>
            <p className="mt-3 text-sm sm:text-base text-white/70">{s.label}</p>
          </motion.div>
        ))}
      </section>

      {/* What we do — full-bleed alternating panels, huge index numerals */}
      <section className="bg-neutral-100">
        <div className="px-6 py-20 max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-red font-semibold text-sm mb-3">What we do</p>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight max-w-2xl">
              Complete apparel production solutions
            </h2>
          </motion.div>
        </div>

        {whatWeDo.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`relative overflow-hidden ${
              i % 2 === 0 ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            <span
              className={`pointer-events-none absolute -right-4 sm:right-4 top-1/2 -translate-y-1/2 text-[10rem] sm:text-[14rem] font-black leading-none select-none ${
                i % 2 === 0 ? "text-black/[0.05]" : "text-white/[0.06]"
              }`}
            >
              {item.index}
            </span>
            <div className="relative max-w-5xl mx-auto px-6 py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-[1fr_1.1fr] gap-6 sm:gap-16">
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {item.title}
              </h3>
              <p
                className={`text-lg self-center ${
                  i % 2 === 0 ? "text-black/65" : "text-white/65"
                }`}
              >
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Why choose us — bold offset grid */}
      <section className="bg-neutral-100 px-6 py-28 sm:py-36">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-4xl sm:text-6xl font-black tracking-tight mb-16 max-w-2xl mx-auto text-center"
        >
          Why manufacturers choose Rightback
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {whyChoose.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className={`p-8 sm:p-10 ${
                i === 0
                  ? "bg-black text-white sm:translate-y-6"
                  : i === 3
                  ? "bg-red text-white sm:-translate-y-6"
                  : "bg-white text-black"
              }`}
            >
              <h3 className="font-bold text-xl sm:text-2xl mb-3 tracking-tight">
                {item.title}
              </h3>
              <p
                className={
                  i === 0 || i === 3 ? "text-white/70" : "text-black/60"
                }
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA — huge diagonal red close */}
      <section className="relative bg-black text-white px-6 py-32 sm:py-44 overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute -left-1/4 top-0 w-[85%] h-full bg-red -skew-x-6 origin-left"
        />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="relative max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-7xl font-black tracking-tight leading-[0.95]">
            Power your production
            <br />
            with smarter technology
          </h2>
          <p className="mt-8 max-w-xl mx-auto text-white/60 text-lg">
            Whether you&apos;re expanding capacity, improving efficiency, or
            investing in automation, Rightback has the technology, and the
            expertise, to support your growth.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 mt-10 px-10 py-5 bg-white text-black text-lg font-semibold hover:bg-red hover:text-white transition-colors duration-300"
          >
            Contact us →
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}