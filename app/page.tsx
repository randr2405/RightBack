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

/** Corner-bracket frame — the recurring nameplate motif used on the hero and CTA. */
function CornerBrackets({ dark = false }: { dark?: boolean }) {
  const stroke = dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.2)";
  const corners = [
    "top-0 left-0",
    "top-0 right-0 rotate-90",
    "bottom-0 right-0 rotate-180",
    "bottom-0 left-0 -rotate-90",
  ];
  return (
    <>
      {corners.map((pos) => (
        <svg
          key={pos}
          className={`pointer-events-none absolute h-6 w-6 sm:h-9 sm:w-9 ${pos}`}
          viewBox="0 0 36 36"
          fill="none"
        >
          <path d="M2 14V2H14" stroke={stroke} strokeWidth="1.5" />
        </svg>
      ))}
    </>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-neutral-100">
      {/* Hero — engineering spec-plate treatment */}
      <section
        ref={heroRef}
        className="relative bg-neutral-100 text-black px-6 pt-28 pb-20 sm:pt-36 sm:pb-28"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="relative border border-black/15 px-6 py-14 sm:px-16 sm:py-20">
            <CornerBrackets />

            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end"
            >
              <div>
                <motion.div
                  variants={fadeUp}
                  className="flex items-center gap-3 text-sm text-black/50 font-mono mb-6"
                >
                  <span>REF. 001</span>
                  <span className="h-px w-10 bg-black/20" />
                  <span>GARMENT MANUFACTURING EQUIPMENT</span>
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  className="text-5xl sm:text-7xl font-bold leading-[1.02] tracking-tight max-w-3xl"
                >
                  Advanced garment
                  <br />
                  manufacturing
                  <br />
                  <span className="text-red">solutions.</span>
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="mt-8 text-lg sm:text-xl text-black/70 max-w-md"
                >
                  Precision machinery. Smarter production. Reliable
                  performance.
                </motion.p>
              </div>

              <motion.div variants={fadeUp}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-base rounded-none hover:bg-red transition-colors duration-300"
                >
                  Explore our solutions
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Intro blurb */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="bg-neutral-100 px-6 pb-24"
      >
        <p className="max-w-2xl mx-auto text-black/70 text-lg sm:text-xl border-l-2 border-red pl-6">
          Rightback supplies world-class apparel manufacturing technology to
          factories across Southern Africa. From sewing and automation to
          cutting, finishing, printing, and digital systems, we help
          manufacturers increase efficiency, quality, and output,{" "}
          <span className="font-semibold text-black">without compromise.</span>
        </p>
      </motion.section>

      {/* Stats — spec-strip, not cards */}
      <section className="bg-black text-white px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
          className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/15"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="px-4 sm:px-8 first:pl-0 font-mono">
              <AnimatedCounter value={s.value} suffix={s.suffix} label={s.label} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Proven machinery */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="bg-neutral-100 px-6 py-24"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Proven, production-ready machinery
          </h2>
          <p className="mt-5 text-black/70 text-lg">
            For over two decades, Rightback has partnered with leading global
            manufacturers to deliver proven, production-ready machinery to
            the garment, denim, and textile industries. We don&apos;t just
            sell machines, we provide complete production solutions, backed
            by technical expertise, trusted brands, and long-term support.
          </p>
        </div>
      </motion.section>

      {/* What we do — numbered production-line index (numbering reflects the actual line sequence) */}
      <section className="bg-white px-6 py-28">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mb-16 max-w-xl"
          >
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Complete apparel production solutions
            </h2>
            <p className="mt-4 text-black/70 text-lg">
              End-to-end equipment for every stage of garment manufacturing,
              helping you streamline operations and stay competitive in a
              fast-moving industry.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="border-t border-black/10"
          >
            {whatWeDo.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="group grid grid-cols-1 sm:grid-cols-[80px_1fr_1.2fr] gap-4 sm:gap-8 py-8 border-b border-black/10 items-baseline"
              >
                <span className="font-mono text-black/30 text-sm">
                  {item.index}
                </span>
                <h3 className="text-xl font-semibold group-hover:text-red transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-black/60 text-base max-w-md">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why choose us — two-column labeled list */}
      <section className="bg-neutral-100 px-6 py-28">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl sm:text-5xl font-bold tracking-tight mb-16 max-w-xl"
          >
            Why manufacturers choose Rightback
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12"
          >
            {whyChoose.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="border-l-2 border-black/10 pl-6"
              >
                <h3 className="font-semibold text-black mb-2 text-lg">
                  {item.title}
                </h3>
                <p className="text-black/60 text-base">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Industries we serve — inline tag row */}
      <section className="px-6 py-24 bg-white">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
            Industries we serve
          </h2>
          <div className="flex flex-wrap gap-3">
            {industries.map((industry) => (
              <span
                key={industry}
                className="px-4 py-2 border border-black/15 text-black/70 text-sm"
              >
                {industry}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA — inverted nameplate, echoes the hero */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="bg-black text-white px-6 py-24"
      >
        <div className="relative max-w-4xl mx-auto border border-white/15 px-6 py-16 sm:px-16 sm:py-20 text-center">
          <CornerBrackets dark />
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl mx-auto">
            Power your production with smarter technology
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-white/60 text-lg">
            Whether you&apos;re expanding capacity, improving efficiency, or
            investing in automation, Rightback has the technology, and the
            expertise, to support your growth.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 mt-10 px-8 py-4 bg-red text-white text-base hover:bg-white hover:text-black transition-colors duration-300"
          >
            Contact us
          </Link>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}