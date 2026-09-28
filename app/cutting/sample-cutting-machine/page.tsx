"use client";

import { useEffect, useRef, useState, memo } from "react";
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

const TWO_PI = Math.PI * 2;

type Dot = {
  ax: number;
  ay: number;
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
};

type DotFieldProps = React.HTMLAttributes<HTMLDivElement> & {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
};

const DotField = memo(function DotField({
  dotRadius = 1.5,
  dotSpacing = 14,
  cursorRadius = 500,
  cursorForce = 0.1,
  bulgeOnly = true,
  bulgeStrength = 67,
  glowRadius = 160,
  sparkle = false,
  waveAmplitude = 0,
  gradientFrom = "rgba(220, 38, 38, 0.35)",
  gradientTo = "rgba(252, 165, 165, 0.25)",
  glowColor = "#1A0505",
  style,
  ...rest
}: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    speed: 0,
  });
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ w: 0, h: 0, offsetX: 0, offsetY: 0 });
  const glowOpacity = useRef(0);
  const engagement = useRef(0);
  const propsRef = useRef({
    dotRadius,
    dotSpacing,
    cursorRadius,
    cursorForce,
    bulgeOnly,
    bulgeStrength,
    sparkle,
    waveAmplitude,
    gradientFrom,
    gradientTo,
  });
  propsRef.current = {
    dotRadius,
    dotSpacing,
    cursorRadius,
    cursorForce,
    bulgeOnly,
    bulgeStrength,
    sparkle,
    waveAmplitude,
    gradientFrom,
    gradientTo,
  };
  const rebuildRef = useRef<(() => void) | null>(null);
  const glowIdRef = useRef(
    `dot-field-glow-${Math.random().toString(36).slice(2, 9)}`
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const glowEl = glowRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    function resize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(doResize, 100);
    }

    function doResize() {
      const rect = (parent as HTMLElement).getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      (canvas as HTMLCanvasElement).width = w * dpr;
      (canvas as HTMLCanvasElement).height = h * dpr;
      (canvas as HTMLCanvasElement).style.width = `${w}px`;
      (canvas as HTMLCanvasElement).style.height = `${h}px`;
      (ctx as CanvasRenderingContext2D).setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = {
        w,
        h,
        offsetX: rect.left + window.scrollX,
        offsetY: rect.top + window.scrollY,
      };

      buildDots(w, h);
    }

    function buildDots(w: number, h: number) {
      const p = propsRef.current;
      const step = p.dotRadius + p.dotSpacing;
      const cols = Math.floor(w / step);
      const rows = Math.floor(h / step);
      const padX = (w % step) / 2;
      const padY = (h % step) / 2;
      const dots: Dot[] = new Array(rows * cols);
      let idx = 0;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const ax = padX + col * step + step / 2;
          const ay = padY + row * step + step / 2;
          dots[idx++] = { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay };
        }
      }
      dotsRef.current = dots;
    }

    function onMouseMove(e: MouseEvent) {
      const s = sizeRef.current;
      mouseRef.current.x = e.pageX - s.offsetX;
      mouseRef.current.y = e.pageY - s.offsetY;
    }

    function updateMouseSpeed() {
      const m = mouseRef.current;
      const dx = m.prevX - m.x;
      const dy = m.prevY - m.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      m.speed += (dist - m.speed) * 0.5;
      if (m.speed < 0.001) m.speed = 0;
      m.prevX = m.x;
      m.prevY = m.y;
    }

    const speedInterval = setInterval(updateMouseSpeed, 20);

    let frameCount = 0;

    function tick() {
      const c = ctx as CanvasRenderingContext2D;
      frameCount++;
      const dots = dotsRef.current;
      const m = mouseRef.current;
      const { w, h } = sizeRef.current;
      const p = propsRef.current;
      const len = dots.length;
      const t = frameCount * 0.02;

      const targetEngagement = Math.min(m.speed / 5, 1);
      engagement.current += (targetEngagement - engagement.current) * 0.06;
      if (engagement.current < 0.001) engagement.current = 0;
      const eng = engagement.current;

      glowOpacity.current += (eng - glowOpacity.current) * 0.08;

      if (glowEl) {
        glowEl.setAttribute("cx", String(m.x));
        glowEl.setAttribute("cy", String(m.y));
        glowEl.style.opacity = String(glowOpacity.current);
      }

      c.clearRect(0, 0, w, h);

      const grad = c.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, p.gradientFrom);
      grad.addColorStop(1, p.gradientTo);
      c.fillStyle = grad;

      const cr = p.cursorRadius;
      const crSq = cr * cr;
      const rad = p.dotRadius / 2;
      const isBulge = p.bulgeOnly;

      c.beginPath();

      for (let i = 0; i < len; i++) {
        const d = dots[i];
        const dx = m.x - d.ax;
        const dy = m.y - d.ay;
        const distSq = dx * dx + dy * dy;

        if (distSq < crSq && eng > 0.01) {
          const dist = Math.sqrt(distSq);
          if (isBulge) {
            const k = 1 - dist / cr;
            const push = k * k * p.bulgeStrength * eng;
            const angle = Math.atan2(dy, dx);
            d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15;
            d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15;
          } else {
            const angle = Math.atan2(dy, dx);
            const move = (500 / dist) * (m.speed * p.cursorForce);
            d.vx += Math.cos(angle) * -move;
            d.vy += Math.sin(angle) * -move;
          }
        } else if (isBulge) {
          d.sx += (d.ax - d.sx) * 0.1;
          d.sy += (d.ay - d.sy) * 0.1;
        }

        if (!isBulge) {
          d.vx *= 0.9;
          d.vy *= 0.9;
          d.x = d.ax + d.vx;
          d.y = d.ay + d.vy;
          d.sx += (d.x - d.sx) * 0.1;
          d.sy += (d.y - d.sy) * 0.1;
        }

        let drawX = d.sx;
        let drawY = d.sy;
        if (p.waveAmplitude > 0) {
          drawY += Math.sin(d.ax * 0.03 + t) * p.waveAmplitude;
          drawX += Math.cos(d.ay * 0.03 + t * 0.7) * p.waveAmplitude * 0.5;
        }

        if (p.sparkle) {
          const hash = ((i * 2654435761) ^ (frameCount >> 3)) >>> 0;
          if (hash % 100 < 3) {
            c.moveTo(drawX + rad * 1.8, drawY);
            c.arc(drawX, drawY, rad * 1.8, 0, TWO_PI);
          } else {
            c.moveTo(drawX + rad, drawY);
            c.arc(drawX, drawY, rad, 0, TWO_PI);
          }
        } else {
          c.moveTo(drawX + rad, drawY);
          c.arc(drawX, drawY, rad, 0, TWO_PI);
        }
      }

      c.fill();

      rafRef.current = requestAnimationFrame(tick);
    }

    doResize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    rebuildRef.current = () => {
      const { w, h } = sizeRef.current;
      if (w > 0 && h > 0) buildDots(w, h);
    };

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      clearInterval(speedInterval);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    rebuildRef.current?.();
  }, [dotRadius, dotSpacing]);

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
      {...rest}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <defs>
          <radialGradient id={glowIdRef.current}>
            <stop offset="0%" stopColor={glowColor} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle
          ref={glowRef}
          cx="-9999"
          cy="-9999"
          r={glowRadius}
          fill={`url(#${glowIdRef.current})`}
          style={{ opacity: 0, willChange: "opacity" }}
        />
      </svg>
    </div>
  );
});

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

  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [50, 0, 0, -30]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.97, 1, 1, 0.98]);
  const blurPx = useTransform(scrollYProgress, [0, 0.22], [8, 0]);
  const filter = useTransform(blurPx, (b) => `blur(${b}px)`);
  const accent = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={
        reduced
          ? undefined
          : { opacity, y, scale, filter, willChange: "transform, opacity" }
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

export default function SampleCuttingMachinePage() {
  const [list, setList] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const reduced = !!useReducedMotion();

  const heroRef = useRef(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroProgress, [0, 1], [1, 0.2]);
  const heroContentY = useTransform(heroProgress, [0, 1], [0, 120]);
  const heroContentScale = useTransform(heroProgress, [0, 1], [1, 0.92]);
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

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "cutting/sample-cutting-machine")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error(
          "Failed to load Sample Cutting Machine products:",
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
        <div className="absolute inset-0">
          <DotField
            dotRadius={1.5}
            dotSpacing={14}
            bulgeStrength={67}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={500}
            cursorForce={0.1}
            bulgeOnly
            gradientFrom="#DC2626"
            gradientTo="#FCA5A5"
            glowColor="#1A0505"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 55% at 50% 40%, rgba(0,0,0,0.5), transparent 70%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-neutral-100 pointer-events-none" />
        </div>

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
          className="relative px-6 pt-28 pb-24 text-center pointer-events-none"
        >
          <motion.div style={reduced ? undefined : { y: eyebrowY }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[#DC2626] font-semibold tracking-widest uppercase text-sm mb-4"
            >
              Cutting
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
              Sample Cutting Machine
            </motion.h1>
          </motion.div>
          <motion.div
            style={reduced ? undefined : { y: subtitleY, opacity: subtitleOpacity }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 max-w-2xl mx-auto text-white/70 text-lg sm:text-xl"
            >
              Precision sample cutting for garments, patterns, and rigid plate
              materials — one machine, multiple cutting modes.
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
                { value: String(list.length), label: "System" },
                { value: "3", label: "Cutting Modes" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  className="text-center"
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
        </motion.div>
      </section>

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
            Choose your system
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-5 h-0.5 w-24 origin-center bg-[#DC2626]"
          />
        </motion.div>

        <div className="relative max-w-6xl mx-auto flex flex-col gap-16">
          {loading && (
            <p className="text-center text-black/40 py-16">
              Loading sample cutting machines…
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
              No sample cutting machines available right now — check back soon.
            </motion.p>
          )}
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