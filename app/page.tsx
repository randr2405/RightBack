"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Footer from "@/components/Footer";
import AnimatedCounter from "@/components/AnimatedCounter";

const whatWeDo = [
  {
    title: "Sewing & Automation",
    description:
      "High-performance sewing machines and engineered workstations built for speed, precision, and consistency.",
  },
  {
    title: "Cutting & CAD Solutions",
    description:
      "CNC cutting and pattern design systems that improve accuracy, reduce waste, and speed up production.",
  },
  {
    title: "Printing, Finishing & Laser",
    description:
      "Modern printing and laser finishing technologies that deliver premium results with lower water, energy, and labour usage.",
  },
  {
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

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Hero with parallax */}
      <section
        ref={heroRef}
        className="relative bg-black text-white text-center px-6 py-40 overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 bg-gradient-to-br from-red/20 via-black to-black"
        />
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative"
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-5xl sm:text-7xl font-bold leading-tight max-w-4xl mx-auto"
          >
            Advanced Garment Manufacturing Solutions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="mt-6 text-lg sm:text-2xl text-white/80"
          >
            Precision machinery. Smarter production. Reliable performance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          >
            <Link
              href="/contact"
              className="inline-block mt-10 px-10 py-4 border border-red text-white rounded-full text-lg hover:bg-red hover:scale-105 transition-all duration-300"
            >
              Explore our solutions
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Intro blurb */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="bg-black text-white text-center px-6 pb-24"
      >
        <p className="max-w-3xl mx-auto text-white/80 text-lg sm:text-xl">
          Rightback supplies world-class apparel manufacturing technology to
          factories across Southern Africa. From sewing and automation to
          cutting, finishing, printing, and digital systems, we help
          manufacturers increase efficiency, quality, and output,{" "}
          <span className="font-semibold text-white">without compromise.</span>
        </p>
      </motion.section>

      {/* Stats */}
      <section className="bg-black px-6 pb-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
          className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8"
        >
          <AnimatedCounter value={20} suffix="+" label="Years Experience" />
          <AnimatedCounter value={500} suffix="+" label="Machines Installed" />
          <AnimatedCounter value={50} suffix="+" label="Factories Served" />
          <AnimatedCounter value={100} suffix="%" label="Support Commitment" />
        </motion.div>
      </section>

      {/* Proven machinery */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="bg-cream text-center px-6 py-24"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-black">
          Proven, production-ready machinery
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-black/70 text-lg">
          For over two decades, Rightback has partnered with leading global
          manufacturers to deliver proven, production-ready machinery to the
          garment, denim, and textile industries. We don&apos;t just sell
          machines, we provide complete production solutions, backed by{" "}
          <span className="font-semibold text-black">
            technical expertise, trusted brands, and long-term support.
          </span>
        </p>
      </motion.section>

      {/* What we do */}
      <section className="bg-black text-white px-6 py-28">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="max-w-6xl mx-auto text-center mb-16"
        >
          <p className="text-red font-semibold tracking-wide uppercase text-sm mb-2">
            What we do
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold">
            Complete Apparel Production Solutions
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-white/70 text-lg">
            Rightback offers end-to-end equipment for every stage of garment
            manufacturing, helping you streamline operations and stay
            competitive in a fast-moving industry.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {whatWeDo.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white/5 rounded-2xl p-6 flex flex-col justify-between border border-white/10 hover:border-red/50 hover:bg-white/10 transition-colors duration-300"
            >
              <div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.description}</p>
              </div>
              <span className="mt-6 inline-block text-red text-sm font-medium cursor-pointer">
                Learn more →
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mt-16 text-white/60"
        >
          Each solution is selected for performance, reliability, and
          real-world production demands.
        </motion.p>
      </section>

      {/* Why choose us */}
      <section className="bg-cream px-6 py-28">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl sm:text-5xl font-bold text-black text-center mb-16"
        >
          Why Choose Rightback
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {whyChoose.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <h3 className="font-semibold text-black mb-3">{item.title}</h3>
              <p className="text-black/70 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Industries we serve */}
      <section className="px-6 py-28 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
              Industries We Serve
            </h2>
            <ul className="space-y-3 text-black/80 text-lg">
              {industries.map((industry, i) => (
                <motion.li
                  key={industry}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-red mt-1.5">●</span>
                  {industry}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 60, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-gradient-to-br from-black/10 to-red/10 rounded-2xl h-64 md:h-96"
          />
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="bg-black text-white text-center px-6 py-28"
      >
        <h2 className="text-3xl sm:text-5xl font-bold max-w-3xl mx-auto">
          Power Your Production with Smarter Technology
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-white/70 text-lg">
          Whether you&apos;re expanding capacity, improving efficiency, or
          investing in automation, Rightback has the technology, and the
          expertise, to support your growth.
        </p>
        <Link
          href="/contact"
          className="inline-block mt-10 px-10 py-4 border border-red text-white rounded-full text-lg hover:bg-red hover:scale-105 transition-all duration-300"
        >
          Contact us
        </Link>
      </motion.section>

      <Footer />
    </div>
  );
}