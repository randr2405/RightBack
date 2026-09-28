"use client";

import { Renderer, Program, Mesh, Triangle, RenderTarget } from "ogl";
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

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const DETAIL_STEPS: Record<string, number> = { low: 20, medium: 32, high: 48 };
const stepsFor = (detail: string) => DETAIL_STEPS[detail] || DETAIL_STEPS.medium;

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uWaveDepth;
uniform float uZoom;
uniform float uDensity;
uniform float uSpread;
uniform float uStepSize;
uniform float uGlow;
uniform float uExposure;
uniform float uColorShift;
uniform float uContrast;
uniform float uBrightness;
uniform float uOpacity;
uniform float uSteps;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uEnableMouse;
uniform float uMouseActive;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uLightMode;
out vec4 fragColor;

void main() {
  vec2 frag = gl_FragCoord.xy;
  float zoom = max(uZoom, 0.05);
  float aspect = iResolution.x / iResolution.y;
  vec2 ndc = (2.0 * frag - iResolution.xy) / iResolution.y;
  vec2 dir = ndc * (0.5 / zoom);

  vec2 mouseNdc = vec2(uMouse.x * aspect, uMouse.y);
  float mr = max(uMouseRadius, 0.01);
  vec2 md = ndc - mouseNdc;
  float dent = exp(-dot(md, md) / (mr * mr)) * (3.0 * uMouseStrength * uEnableMouse * uMouseActive);

  float travel = sin(iTime * uSpeed) * uWaveDepth;
  float density = max(uDensity, 1.0);
  float spread = clamp(uSpread, 0.05, 0.6);
  float stepSize = max(uStepSize, 0.0005);
  float glowGain = max(uGlow, 0.0);

  vec3 tOffset = vec3(0.0, dent, travel);
  vec3 p = vec3(0.0);
  float s = 0.0;
  float glow = 0.0;

  for (int i = 0; i < 64; i++) {
    if (float(i) >= uSteps) break;
    p += vec3(dir * s, s);
    vec3 q = p + tOffset;
    s += density - length(q.xz) + length(ceil(q).xy);
    s = stepSize + abs(s) * spread;
    glow += glowGain / s;
  }

  float e = glow / max(uExposure, 1.0);
  float shimmer = 0.5 + 0.5 * dot(cos(iTime * uColorShift + p), vec3(0.3333));
  float v = tanh(e * uBrightness * mix(0.7, 1.05, shimmer));
  v = clamp((v - 0.5) * uContrast + 0.5, 0.0, 1.0);

  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, 0.55, v));
  col = mix(col, uColor3, smoothstep(0.55, 1.0, v));
  col *= v;

  float a = clamp(v, 0.0, 1.0) * uOpacity;
  vec3 outRgb = col * a;
  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    outRgb = clamp(outRgb + gv, 0.0, 1.0);
    a = clamp(a + gv, 0.0, 1.0);
  }
  if (uLightMode > 0.5) {
    float peak = max(col.r, max(col.g, col.b));
    vec3 chroma = pow(clamp(col / max(peak, 0.0001), 0.0, 1.0), vec3(1.16));
    fragColor = vec4(mix(vec3(1.0), chroma, a * 0.94), 1.0);
  } else {
    fragColor = vec4(outRgb, a);
  }
}
`;

const postFragment = `#version 300 es
precision highp float;
uniform sampler2D tMap;
uniform vec2 iResolution;
uniform vec2 uDirection;
uniform float uRadius;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float iTime;
out vec4 fragColor;

vec4 samp(vec2 uv) {
  return texture(tMap, uv);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution;
  vec2 texel = uDirection / iResolution;
  float st = uRadius * 0.25;
  vec4 sum = samp(uv) * 0.2026;
  sum += (samp(uv + texel * st) + samp(uv - texel * st)) * 0.179;
  sum += (samp(uv + texel * (st * 2.0)) + samp(uv - texel * (st * 2.0))) * 0.124;
  sum += (samp(uv + texel * (st * 3.0)) + samp(uv - texel * (st * 3.0))) * 0.0672;
  sum += (samp(uv + texel * (st * 4.0)) + samp(uv - texel * (st * 4.0))) * 0.0285;
  vec4 col = sum;
  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    col.rgb = clamp(col.rgb + gv, 0.0, 1.0);
    col.a = clamp(col.a + gv, 0.0, 1.0);
  }
  fragColor = col;
}
`;

const ctxMap = new WeakMap<HTMLElement, { program: Program }>();

type AcidSquaresProps = {
  color1?: string;
  color2?: string;
  color3?: string;
  detail?: "low" | "medium" | "high";
  speed?: number;
  waveDepth?: number;
  zoom?: number;
  density?: number;
  glow?: number;
  exposure?: number;
  spread?: number;
  stepSize?: number;
  colorShift?: number;
  contrast?: number;
  brightness?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  blur?: number;
  grain?: boolean;
  grainIntensity?: number;
  lightMode?: boolean;
};

function AcidSquares({
  color1 = "#7F1D1D",
  color2 = "#DC2626",
  color3 = "#FCA5A5",
  detail = "medium",
  speed = 0.7,
  waveDepth = 1,
  zoom = 1.3,
  density = 10.0,
  glow = 1.0,
  exposure = 2700,
  spread = 0.3,
  stepSize = 0.002,
  colorShift = 0,
  contrast = 1,
  brightness = 1.0,
  opacity = 1.0,
  mouseInteraction = true,
  mouseStrength = 0.1,
  mouseRadius = 0.35,
  blur = 0,
  grain = true,
  grainIntensity = 0.05,
  lightMode = false,
}: AcidSquaresProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseTarget = useRef<[number, number]>([0, 0]);
  const mouseCurrent = useRef<[number, number]>([0, 0]);
  const enableMouseRef = useRef(mouseInteraction);
  const mouseStrengthRef = useRef(mouseStrength);
  const mouseActive = useRef(0);
  const mouseActiveTarget = useRef(0);
  const blurRef = useRef(blur);
  const grainRef = useRef(grain);
  const grainIntensityRef = useRef(grainIntensity);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: 0.7 },
        uWaveDepth: { value: 1 },
        uZoom: { value: 1.3 },
        uDensity: { value: 10.0 },
        uSpread: { value: 0.3 },
        uStepSize: { value: 0.002 },
        uGlow: { value: 1.0 },
        uExposure: { value: 2700 },
        uColorShift: { value: 0 },
        uContrast: { value: 1 },
        uBrightness: { value: 1.0 },
        uOpacity: { value: 1.0 },
        uSteps: { value: 32 },
        uColor1: { value: new Float32Array([1, 1, 1]) },
        uColor2: { value: new Float32Array([1, 1, 1]) },
        uColor3: { value: new Float32Array([1, 1, 1]) },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseStrength: { value: 0.1 },
        uMouseRadius: { value: 0.35 },
        uEnableMouse: { value: 1.0 },
        uMouseActive: { value: 0.0 },
        uGrain: { value: 1.0 },
        uGrainIntensity: { value: 0.05 },
        uLightMode: { value: 0.0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const postProgram = new Program(gl, {
      vertex,
      fragment: postFragment,
      uniforms: {
        tMap: { value: null },
        iResolution: { value: new Float32Array([1, 1]) },
        uDirection: { value: new Float32Array([1, 0]) },
        uRadius: { value: 0 },
        uGrain: { value: 0 },
        uGrainIntensity: { value: 0.05 },
        iTime: { value: 0 },
      },
    });
    const postMesh = new Mesh(gl, { geometry, program: postProgram });

    let rtA: RenderTarget | null = null;
    let rtB: RenderTarget | null = null;
    const ensureTargets = () => {
      if (!rtA) {
        const bw = gl.drawingBufferWidth;
        const bh = gl.drawingBufferHeight;
        rtA = new RenderTarget(gl, { width: bw, height: bh, depth: false });
        rtB = new RenderTarget(gl, { width: bw, height: bh, depth: false });
      }
    };

    const renderFrame = () => {
      const grainOn = grainRef.current ? 1.0 : 0.0;
      const grainAmt = grainIntensityRef.current;
      program.uniforms.uGrainIntensity.value = grainAmt;
      postProgram.uniforms.uGrainIntensity.value = grainAmt;
      if (blurRef.current > 0) {
        ensureTargets();
        if (!rtA || !rtB) return;
        program.uniforms.uGrain.value = 0.0;
        renderer.render({ scene: mesh, target: rtA });
        const pu = postProgram.uniforms;
        pu.uRadius.value = blurRef.current * 14.0;
        pu.tMap.value = rtA.textures[0];
        pu.uDirection.value[0] = 1;
        pu.uDirection.value[1] = 0;
        pu.uGrain.value = 0.0;
        renderer.render({ scene: postMesh, target: rtB });
        pu.tMap.value = rtB.textures[0];
        pu.uDirection.value[0] = 0;
        pu.uDirection.value[1] = 1;
        pu.uGrain.value = grainOn;
        renderer.render({ scene: postMesh });
      } else {
        program.uniforms.uGrain.value = grainOn;
        renderer.render({ scene: mesh });
      }
    };

    ctxMap.set(container, { program });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h);
      const bw = gl.drawingBufferWidth;
      const bh = gl.drawingBufferHeight;
      const res = program.uniforms.iResolution.value;
      res[0] = bw;
      res[1] = bh;
      const pres = postProgram.uniforms.iResolution.value;
      pres[0] = bw;
      pres[1] = bh;
      if (rtA && rtB) {
        rtA.setSize(bw, bh);
        rtB.setSize(bw, bh);
      }
      renderFrame();
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) {
        mouseActiveTarget.current = 0;
        return;
      }
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2.0;
      const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2.0;
      mouseTarget.current = [x, y];
      mouseActiveTarget.current = 1;
    };
    const handleMouseLeave = () => {
      mouseActiveTarget.current = 0;
    };
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const t0 = performance.now();

    const loop = (t: number) => {
      program.uniforms.iTime.value = (t - t0) * 0.001;

      const cur = mouseCurrent.current;
      const tgt = mouseTarget.current;
      cur[0] += 0.05 * (tgt[0] - cur[0]);
      cur[1] += 0.05 * (tgt[1] - cur[1]);
      const m = program.uniforms.uMouse.value;
      m[0] = cur[0];
      m[1] = cur[1];
      const activeTarget = enableMouseRef.current ? mouseActiveTarget.current : 0;
      mouseActive.current += 0.05 * (activeTarget - mouseActive.current);
      program.uniforms.uMouseActive.value = mouseActive.current;
      program.uniforms.uEnableMouse.value = enableMouseRef.current ? 1.0 : 0.0;
      program.uniforms.uMouseStrength.value = mouseStrengthRef.current;

      postProgram.uniforms.iTime.value = program.uniforms.iTime.value;
      renderFrame();
      raf = requestAnimationFrame(loop);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
    };
    const tryStop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) tryStart();
        else tryStop();
      },
      { threshold: 0 }
    );
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) tryStart();
      else tryStop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    tryStart();

    return () => {
      tryStop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      ctxMap.delete(container);
      const a = rtA as RenderTarget | null;
      const b = rtB as RenderTarget | null;
      if (a && b) {
        gl.deleteFramebuffer(a.buffer);
        gl.deleteFramebuffer(b.buffer);
        a.textures.forEach((tex) => gl.deleteTexture(tex.texture));
        b.textures.forEach((tex) => gl.deleteTexture(tex.texture));
      }
      try {
        container.removeChild(canvas);
      } catch {}
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ctx = ctxMap.get(container);
    if (!ctx) return;
    const u = ctx.program.uniforms;

    u.uSpeed.value = speed;
    u.uWaveDepth.value = waveDepth;
    u.uZoom.value = zoom;
    u.uDensity.value = density;
    u.uSpread.value = spread;
    u.uStepSize.value = stepSize;
    u.uGlow.value = glow;
    u.uExposure.value = exposure;
    u.uColorShift.value = colorShift;
    u.uContrast.value = contrast;
    u.uBrightness.value = brightness;
    u.uOpacity.value = opacity;
    u.uLightMode.value = lightMode ? 1.0 : 0.0;
    u.uSteps.value = stepsFor(detail);
    u.uMouseRadius.value = mouseRadius;

    const c1 = hexToRgb(color1);
    const a1 = u.uColor1.value;
    a1[0] = c1[0];
    a1[1] = c1[1];
    a1[2] = c1[2];
    const c2 = hexToRgb(color2);
    const a2 = u.uColor2.value;
    a2[0] = c2[0];
    a2[1] = c2[1];
    a2[2] = c2[2];
    const c3 = hexToRgb(color3);
    const a3 = u.uColor3.value;
    a3[0] = c3[0];
    a3[1] = c3[1];
    a3[2] = c3[2];

    enableMouseRef.current = mouseInteraction;
    mouseStrengthRef.current = mouseStrength;
    blurRef.current = blur;
    grainRef.current = grain;
    grainIntensityRef.current = grainIntensity;
  }, [
    color1,
    color2,
    color3,
    detail,
    speed,
    waveDepth,
    zoom,
    density,
    glow,
    exposure,
    spread,
    stepSize,
    colorShift,
    contrast,
    brightness,
    opacity,
    mouseInteraction,
    mouseStrength,
    mouseRadius,
    blur,
    grain,
    grainIntensity,
    lightMode,
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    />
  );
}

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

  // Enter (0 -> 0.22), hold, then gently recede as the card leaves (0.8 -> 1)
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.8, 1], [0, 1, 1, 0.35]);
  const y = useTransform(scrollYProgress, [0, 0.22, 0.8, 1], [90, 0, 0, -40]);
  const x = useTransform(scrollYProgress, [0, 0.22], [direction * 60, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.22, 0.8, 1], [0.94, 1, 1, 0.97]);
  const rotate = useTransform(scrollYProgress, [0, 0.22], [direction * 1.5, 0]);
  const blurPx = useTransform(scrollYProgress, [0, 0.18], [6, 0]);
  const filter = useTransform(blurPx, (b) => `blur(${b}px)`);

  // Small accent bar that fills while the card crosses the viewport
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

  // Layered parallax: each hero element drifts at its own rate
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

  // Marquee band: text slides horizontally as the band scrolls through view
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
          <AcidSquares
            color1="#7F1D1D"
            color2="#DC2626"
            color3="#FCA5A5"
            detail="medium"
            speed={0.7}
            waveDepth={1}
            zoom={1.3}
            density={10}
            glow={1}
            exposure={2700}
            spread={0.3}
            stepSize={0.002}
            colorShift={0}
            contrast={1}
            brightness={1}
            opacity={1}
            mouseInteraction
            mouseStrength={0.1}
            mouseRadius={0.35}
            blur={0}
            grain
            grainIntensity={0.05}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 55% at 50% 40%, rgba(0,0,0,0.45), transparent 70%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-neutral-100 pointer-events-none" />
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
              className="mt-6 max-w-2xl mx-auto text-white/70 text-lg sm:text-xl"
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
                  <div className="mt-1 text-sm uppercase tracking-wider text-white/50">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Scroll-driven marquee band */}
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