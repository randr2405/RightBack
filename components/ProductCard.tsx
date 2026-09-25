"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Check, ImageIcon } from "lucide-react";

export type SpecRow = { label: string; value: string };
export type ItemGroup = { label: string; items: string[] };

export type ProductCardProps = {
  index: number;
  brand: string;
  name: string;
  tagline: string;
  description?: string[];
  moreInfo?: string[];
  groups?: ItemGroup[];
  specs?: SpecRow[];
  imageSrc?: string;
};

type ElectricBorderProps = {
  children: React.ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  borderRadius?: number;
  className?: string;
  style?: React.CSSProperties;
};

function ElectricBorder({
  children,
  color = "#DC2626",
  speed = 1,
  chaos = 0.12,
  borderRadius = 24,
  className,
  style,
}: ElectricBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const random = useCallback((x: number) => {
    return (Math.sin(x * 12.9898) * 43758.5453) % 1;
  }, []);

  const noise2D = useCallback(
    (x: number, y: number) => {
      const i = Math.floor(x);
      const j = Math.floor(y);
      const fx = x - i;
      const fy = y - j;

      const a = random(i + j * 57);
      const b = random(i + 1 + j * 57);
      const c = random(i + (j + 1) * 57);
      const d = random(i + 1 + (j + 1) * 57);

      const ux = fx * fx * (3.0 - 2.0 * fx);
      const uy = fy * fy * (3.0 - 2.0 * fy);

      return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
    },
    [random]
  );

  const octavedNoise = useCallback(
    (
      x: number,
      octaves: number,
      lacunarity: number,
      gain: number,
      baseAmplitude: number,
      baseFrequency: number,
      time: number,
      seed: number,
      baseFlatness: number
    ) => {
      let y = 0;
      let amplitude = baseAmplitude;
      let frequency = baseFrequency;

      for (let i = 0; i < octaves; i++) {
        let octaveAmplitude = amplitude;
        if (i === 0) {
          octaveAmplitude *= baseFlatness;
        }
        y += octaveAmplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
        frequency *= lacunarity;
        amplitude *= gain;
      }

      return y;
    },
    [noise2D]
  );

  const getCornerPoint = useCallback(
    (centerX: number, centerY: number, radius: number, startAngle: number, arcLength: number, progress: number) => {
      const angle = startAngle + progress * arcLength;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    },
    []
  );

  const getRoundedRectPoint = useCallback(
    (t: number, left: number, top: number, width: number, height: number, radius: number) => {
      const straightWidth = width - 2 * radius;
      const straightHeight = height - 2 * radius;
      const cornerArc = (Math.PI * radius) / 2;
      const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
      const distance = t * totalPerimeter;

      let accumulated = 0;

      if (distance <= accumulated + straightWidth) {
        const progress = (distance - accumulated) / straightWidth;
        return { x: left + radius + progress * straightWidth, y: top };
      }
      accumulated += straightWidth;

      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, progress);
      }
      accumulated += cornerArc;

      if (distance <= accumulated + straightHeight) {
        const progress = (distance - accumulated) / straightHeight;
        return { x: left + width, y: top + radius + progress * straightHeight };
      }
      accumulated += straightHeight;

      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, progress);
      }
      accumulated += cornerArc;

      if (distance <= accumulated + straightWidth) {
        const progress = (distance - accumulated) / straightWidth;
        return { x: left + width - radius - progress * straightWidth, y: top + height };
      }
      accumulated += straightWidth;

      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, progress);
      }
      accumulated += cornerArc;

      if (distance <= accumulated + straightHeight) {
        const progress = (distance - accumulated) / straightHeight;
        return { x: left, y: top + height - radius - progress * straightHeight };
      }
      accumulated += straightHeight;

      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, progress);
    },
    [getCornerPoint]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const octaves = 10;
    const lacunarity = 1.6;
    const gain = 0.7;
    const amplitude = chaos;
    const frequency = 10;
    const baseFlatness = 0;
    const displacement = 60;
    const borderOffset = 60;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width + borderOffset * 2;
      const height = rect.height + borderOffset * 2;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      return { width, height };
    };

    let { width, height } = updateSize();
    let lastDpr = Math.min(window.devicePixelRatio || 1, 2);

    const drawElectricBorder = (currentTime: number) => {
      if (!canvas || !ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (dpr !== lastDpr) {
        lastDpr = dpr;
        const newSize = updateSize();
        width = newSize.width;
        height = newSize.height;
      }

      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      timeRef.current += deltaTime * speed;
      lastFrameTimeRef.current = currentTime;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const scale = displacement;
      const left = borderOffset;
      const top = borderOffset;
      const borderWidth = width - 2 * borderOffset;
      const borderHeight = height - 2 * borderOffset;
      const maxRadius = Math.min(borderWidth, borderHeight) / 2;
      const radius = Math.min(borderRadius, maxRadius);

      const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
      const sampleCount = Math.floor(approximatePerimeter / 2);

      ctx.beginPath();

      for (let i = 0; i <= sampleCount; i++) {
        const progress = i / sampleCount;

        const point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);

        const xNoise = octavedNoise(
          progress * 8,
          octaves,
          lacunarity,
          gain,
          amplitude,
          frequency,
          timeRef.current,
          0,
          baseFlatness
        );

        const yNoise = octavedNoise(
          progress * 8,
          octaves,
          lacunarity,
          gain,
          amplitude,
          frequency,
          timeRef.current,
          1,
          baseFlatness
        );

        const displacedX = point.x + xNoise * scale;
        const displacedY = point.y + yNoise * scale;

        if (i === 0) {
          ctx.moveTo(displacedX, displacedY);
        } else {
          ctx.lineTo(displacedX, displacedY);
        }
      }

      ctx.closePath();
      ctx.stroke();

      animationRef.current = requestAnimationFrame(drawElectricBorder);
    };

    const resizeObserver = new ResizeObserver(() => {
      const newSize = updateSize();
      width = newSize.width;
      height = newSize.height;
    });
    resizeObserver.observe(container);

    animationRef.current = requestAnimationFrame(drawElectricBorder);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [color, speed, chaos, borderRadius, octavedNoise, getRoundedRectPoint]);

  const vars = {
    "--electric-border-color": color,
    borderRadius,
  } as React.CSSProperties;

  return (
    <div ref={containerRef} className={`electric-border ${className ?? ""}`} style={{ ...vars, ...style }}>
      <style jsx>{`
        .electric-border {
          --electric-light-color: ${color};
          position: relative;
          border-radius: inherit;
          overflow: visible;
          isolation: isolate;
        }

        .eb-canvas-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 2;
        }

        .eb-canvas {
          display: block;
        }

        .eb-content {
          position: relative;
          border-radius: inherit;
          z-index: 1;
        }

        .eb-layers {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 0;
        }

        .eb-glow-1,
        .eb-glow-2,
        .eb-background-glow {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          box-sizing: border-box;
        }

        .eb-glow-1 {
          border: 2px solid ${color}99;
          filter: blur(1px);
        }

        .eb-glow-2 {
          border: 2px solid var(--electric-light-color);
          filter: blur(4px);
        }

        .eb-background-glow {
          z-index: -1;
          transform: scale(1.1);
          filter: blur(32px);
          opacity: 0.3;
          background: linear-gradient(-30deg, var(--electric-light-color), transparent, ${color});
        }
      `}</style>
      <div className="eb-canvas-container">
        <canvas ref={canvasRef} className="eb-canvas" />
      </div>
      <div className="eb-layers">
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div className="eb-content">{children}</div>
    </div>
  );
}

export default function ProductCard({
  index,
  brand,
  name,
  tagline,
  description,
  moreInfo,
  groups,
  specs,
  imageSrc,
}: ProductCardProps) {
  const ref = useRef(null);

  type TabKey = "info" | "specs" | `group-${number}`;

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    ...(moreInfo?.length ? [{ key: "info" as TabKey, label: "Details" }] : []),
    ...(groups ?? []).map((g, i) => ({
      key: `group-${i}` as TabKey,
      label: g.label,
      count: g.items.length,
    })),
    ...(specs?.length
      ? [{ key: "specs" as TabKey, label: "Specifications", count: specs.length }]
      : []),
  ];

  const [tab, setTab] = useState<TabKey>(tabs[0]?.key ?? "info");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-16, 16]);

  const activeGroup =
    tab.startsWith("group-") && groups
      ? groups[parseInt(tab.split("-")[1], 10)]
      : null;

  const isReversed = index % 2 === 0;

  return (
    <article ref={ref} className="relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 sm:py-20">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 items-center ${
            isReversed ? "lg:[direction:rtl]" : ""
          }`}
        >
          <div
            className={`lg:col-span-5 [direction:ltr] ${
              isReversed ? "lg:order-2" : ""
            }`}
          >
            <div className="relative">
              <span className="absolute -top-8 -left-2 text-8xl sm:text-9xl font-black text-black/[0.04] tabular-nums leading-none select-none pointer-events-none">
                {String(index).padStart(2, "0")}
              </span>

              <ElectricBorder color="#DC2626" speed={1} chaos={0.12} borderRadius={24}>
                <div className="relative rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-black/[0.06] overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden bg-white">
                    {imageSrc ? (
                      <motion.img
                        style={{ scale: imageScale, y: imageY }}
                        src={imageSrc}
                        alt={name}
                        className="w-full h-full object-contain p-6"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-black/20">
                        <ImageIcon size={32} strokeWidth={1} />
                        <span className="text-[11px] tracking-wide">No image yet</span>
                      </div>
                    )}
                  </div>
                  <div className="px-5 py-3 border-t border-black/[0.06] flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
                      {brand}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red">
                      {String(index).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </ElectricBorder>
            </div>
          </div>

          <div className={`lg:col-span-7 [direction:ltr] ${isReversed ? "lg:order-1" : ""}`}>
            <h3 className="text-3xl sm:text-4xl font-semibold text-black leading-[1.1] tracking-tight mb-4">
              {name}
            </h3>

            <p className="text-lg text-black/70 italic leading-snug mb-6 pl-4 border-l-2 border-red/40">
              {tagline}
            </p>

            <div className="space-y-4 text-black/60 text-[15px] leading-relaxed mb-10 max-w-xl">
              {(description ?? []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {tabs.length > 0 && (
              <div>
                {tabs.length > 1 ? (
                  <div className="flex flex-wrap gap-x-7 gap-y-2 border-b border-black/10 mb-8">
                    {tabs.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className="relative pb-3 text-[13px] font-medium tracking-wide flex items-center gap-1.5 whitespace-nowrap"
                        style={{ color: tab === t.key ? "#1A1A1A" : "#1A1A1A55" }}
                      >
                        {t.label}
                        {t.count ? (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{
                              background: tab === t.key ? "#1A1A1A" : "#1A1A1A0D",
                              color: tab === t.key ? "#fff" : "#1A1A1A66",
                            }}
                          >
                            {t.count}
                          </span>
                        ) : null}
                        {tab === t.key && (
                          <motion.span
                            layoutId={`underline-${name}`}
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                            className="absolute left-0 right-0 -bottom-px h-[1.5px] bg-red"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 mb-8">
                    <span className="relative pb-3 text-[13px] font-medium tracking-wide text-black">
                      {tabs[0].label}
                      <span className="absolute left-0 right-0 -bottom-px h-[1.5px] bg-red" />
                    </span>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {tab === "info" && moreInfo?.length ? (
                    <motion.div
                      key="info"
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0 }}
                      variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.05 } },
                      }}
                      className="space-y-4 text-black/60 text-[14px] leading-relaxed max-w-xl"
                    >
                      {moreInfo.map((para, i) => (
                        <motion.p
                          key={i}
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            show: { opacity: 1, y: 0 },
                          }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {para}
                        </motion.p>
                      ))}
                    </motion.div>
                  ) : null}

                  {activeGroup ? (
                    <motion.div
                      key={tab}
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0 }}
                      variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.03 } },
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {activeGroup.items.map((item, i) => (
                        <motion.div
                          key={i}
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            show: { opacity: 1, y: 0 },
                          }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 border border-black/5"
                        >
                          <span className="mt-0.5 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                            <Check size={11} strokeWidth={3} />
                          </span>
                          <span className="text-[13.5px] text-black/75 leading-snug">
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : null}

                  {tab === "specs" && specs?.length ? (
                    <motion.div
                      key="specs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-xl border border-black/10 divide-y divide-black/[0.06] overflow-hidden"
                    >
                      {specs.map((spec, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
                        >
                          <div className="px-4 py-3 text-[12px] font-medium text-black/50 uppercase tracking-wide bg-neutral-50 border-r border-black/[0.06]">
                            {spec.label}
                          </div>
                          <div className="px-4 py-3 text-[13.5px] text-black font-mono">
                            {spec.value}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="border-t border-black/[0.06]" />
      </div>
    </article>
  );
}