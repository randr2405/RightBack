"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

const crtVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const crtFragmentShader = `
precision highp float;

varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uBackgroundColor;
uniform float uCurvature;
uniform float uScanlineStrength;
uniform float uScanlineFrequency;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uBloom;
uniform float uBloomRadius;
uniform float uNoise;
uniform float uVignette;
uniform float uBrightness;
uniform float uPixelation;
uniform float uRgbShift;
uniform vec2 uPointer;
uniform float uMouseStrength;
uniform float uMouseReact;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec2 crtCurve(vec2 uv, float radius) {
  vec2 p = (uv - 0.5) * 2.0;
  float safeRadius = max(radius, 1.415);
  float cornerScale = safeRadius / sqrt(max(safeRadius * safeRadius - 2.0, 0.001));
  p = safeRadius * p / sqrt(max(safeRadius * safeRadius - dot(p, p), 0.001));
  p /= cornerScale;
  return p * 0.5 + 0.5;
}

float referencePlasma(vec2 uv, float t) {
  float frequencyScale = max(uWaveFrequency / 2.2, 0.001);
  uv = (uv - 0.5) * frequencyScale + 0.5;

  float scanline = 0.5 - 0.5 * cos(uv.y * 3.14159265 * uScanlineFrequency);
  scanline = mix(1.0, scanline, uScanlineStrength);

  uv *= vec2(80.0, 24.0);
  uv = ceil(uv);
  uv /= vec2(80.0, 24.0);

  float amplitude = uWaveAmplitude / 0.28;
  float field = 0.0;
  field += 0.7 * sin(0.5 * uv.x + t / 5.0);
  field += 3.0 * sin(1.6 * uv.y + t / 5.0);
  field += sin(10.0 * (uv.y * sin(t / 2.0) + uv.x * cos(t / 5.0)) + t / 2.0);

  float cx = uv.x + 0.5 * sin(t / 2.0);
  float cy = uv.y + 0.5 * cos(t / 4.0);
  field += 0.4 * sin(sqrt(100.0 * cx * cx + 100.0 * cy * cy + 1.0) + t);
  field += 0.9 * sin(sqrt(75.0 * cx * cx + 25.0 * cy * cy + 1.0) + t);
  field -= 1.4 * sin(sqrt(256.0 * cx * cx + 25.0 * cy * cy + 1.0) + t);
  field += 0.3 * sin(0.5 * uv.y + uv.x + sin(t));

  return scanline * floor(3.0 * (0.5 + 0.499 * sin(field * amplitude))) / 3.0;
}

void main() {
  vec2 uv = vUv;
  if (uPixelation > 1.001) {
    vec2 cells = max(uResolution / uPixelation, vec2(1.0));
    uv = (floor(uv * cells) + 0.5) / cells;
  }

  float curveRadius = 1.1 + 0.42 / max(uCurvature, 0.001);
  if (uMouseReact > 0.5) {
    curveRadius *= exp(-uPointer.y * uMouseStrength * 0.4);
  }
  vec2 curvedUv = crtCurve(uv, curveRadius);
  if (uMouseReact > 0.5) {
    curvedUv.x -= uPointer.x * uMouseStrength * 0.035;
  }

  float signal = referencePlasma(curvedUv, uTime);
  float radius = 0.01 * uBloomRadius;
  float glow = signal * 0.2;
  glow += referencePlasma(curvedUv + vec2(radius, 0.0), uTime) * 0.12;
  glow += referencePlasma(curvedUv - vec2(radius, 0.0), uTime) * 0.12;
  glow += referencePlasma(curvedUv + vec2(0.0, radius), uTime) * 0.12;
  glow += referencePlasma(curvedUv - vec2(0.0, radius), uTime) * 0.12;
  glow += referencePlasma(curvedUv + vec2(radius), uTime) * 0.08;
  glow += referencePlasma(curvedUv - vec2(radius), uTime) * 0.08;
  glow += referencePlasma(curvedUv + vec2(radius, -radius), uTime) * 0.08;
  glow += referencePlasma(curvedUv + vec2(-radius, radius), uTime) * 0.08;

  float redSignal = referencePlasma(curvedUv + vec2(uRgbShift, 0.0), uTime);
  float blueSignal = referencePlasma(curvedUv - vec2(uRgbShift, 0.0), uTime);
  vec3 channelSignal = vec3(redSignal, signal, blueSignal);
  vec3 waveColor = uColor * (0.3 + signal * 0.7 + glow * uBloom * 0.65);
  waveColor += (channelSignal - signal) * 0.42;

  float edge = clamp(1.0 - dot(vUv - 0.5, vUv - 0.5) * 2.0, 0.0, 1.0);
  float edgeFade = mix(1.0, smoothstep(0.0, 1.0, edge), uVignette);
  float waveMask = clamp(signal * 0.82 + glow * 0.52, 0.0, 1.0) * edgeFade;

  float grain = hash21(gl_FragCoord.xy + vec2(fract(uTime) * 173.0));
  waveColor = max(waveColor * uBrightness, vec3(0.0));
  vec3 color = mix(uBackgroundColor, waveColor, waveMask);
  color += (grain - 0.5) * uNoise;
  gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
}
`;

type CRTWarpProps = {
  color?: string;
  backgroundColor?: string;
  speed?: number;
  curvature?: number;
  scanlineStrength?: number;
  scanlineFrequency?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  bloom?: number;
  bloomRadius?: number;
  noise?: number;
  vignette?: number;
  brightness?: number;
  pixelation?: number;
  rgbShift?: number;
  mouseReact?: boolean;
  mouseStrength?: number;
  dpr?: number;
  fps?: number;
  paused?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function CRTWarp({
  color = "#DC2626",
  backgroundColor = "#0A0A0A",
  speed = 0.5,
  curvature = 0.25,
  scanlineStrength = 0.25,
  scanlineFrequency = 200,
  waveAmplitude = 0.3,
  waveFrequency = 2.5,
  bloom = 1.5,
  bloomRadius = 1,
  noise = 0.1,
  vignette = 0,
  brightness = 1.25,
  pixelation = 1,
  rgbShift = 0.015,
  mouseReact = true,
  mouseStrength = 0.5,
  dpr = 1,
  fps = 30,
  paused = false,
  className,
  style,
}: CRTWarpProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const pausedRef = useRef(paused);
  const pointerTargetRef = useRef(new THREE.Vector2(0, 0));
  const pointerCurrentRef = useRef(new THREE.Vector2(0, 0));
  const visibleRef = useRef(true);
  const fpsRef = useRef(fps);
  const lastFrameRef = useRef(0);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    fpsRef.current = Math.max(1, fps);
  }, [fps]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: crtVertexShader,
      fragmentShader: crtFragmentShader,
      uniforms: {
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uSpeed: { value: 0.5 },
        uColor: { value: new THREE.Color("#DC2626") },
        uBackgroundColor: { value: new THREE.Color("#0A0A0A") },
        uCurvature: { value: 0.25 },
        uScanlineStrength: { value: 0.25 },
        uScanlineFrequency: { value: 200 },
        uWaveAmplitude: { value: 0.3 },
        uWaveFrequency: { value: 2.5 },
        uBloom: { value: 1.5 },
        uBloomRadius: { value: 1 },
        uNoise: { value: 0.1 },
        uVignette: { value: 0 },
        uBrightness: { value: 1.25 },
        uPixelation: { value: 1 },
        uRgbShift: { value: 0.015 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uMouseStrength: { value: 0.5 },
        uMouseReact: { value: 1 },
      },
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "low-power" });
    rendererRef.current = renderer;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height, false);
      material.uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const clock = new THREE.Clock();
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    visibilityObserver.observe(container);

    const render = (now: number) => {
      frameRef.current = requestAnimationFrame(render);
      if (!visibleRef.current || document.hidden) return;
      const interval = 1000 / fpsRef.current;
      if (now - lastFrameRef.current < interval) return;
      lastFrameRef.current = now - ((now - lastFrameRef.current) % interval);
      const delta = Math.min(clock.getDelta(), 0.1);
      if (!pausedRef.current) material.uniforms.uTime.value += delta * material.uniforms.uSpeed.value;
      pointerCurrentRef.current.lerp(pointerTargetRef.current, 0.08);
      material.uniforms.uPointer.value.copy(pointerCurrentRef.current);
      renderer.render(scene, camera);
    };

    render(0);

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerTargetRef.current.set(
        ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1,
        -(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1)
      );
    };
    const onPointerLeave = () => pointerTargetRef.current.set(0, 0);
    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      materialRef.current = null;
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    const material = materialRef.current;
    const renderer = rendererRef.current;
    if (!material || !renderer) return;
    const uniforms = material.uniforms;
    uniforms.uColor.value.set(color);
    uniforms.uBackgroundColor.value.set(backgroundColor);
    uniforms.uSpeed.value = speed;
    uniforms.uCurvature.value = curvature;
    uniforms.uScanlineStrength.value = scanlineStrength;
    uniforms.uScanlineFrequency.value = scanlineFrequency;
    uniforms.uWaveAmplitude.value = waveAmplitude;
    uniforms.uWaveFrequency.value = waveFrequency;
    uniforms.uBloom.value = bloom;
    uniforms.uBloomRadius.value = bloomRadius;
    uniforms.uNoise.value = noise;
    uniforms.uVignette.value = vignette;
    uniforms.uBrightness.value = brightness;
    uniforms.uPixelation.value = pixelation;
    uniforms.uRgbShift.value = rgbShift;
    uniforms.uMouseReact.value = mouseReact ? 1 : 0;
    uniforms.uMouseStrength.value = mouseStrength;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dpr));
    const container = containerRef.current;
    if (container) {
      renderer.setSize(Math.max(container.clientWidth, 1), Math.max(container.clientHeight, 1), false);
      uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height);
    }
  }, [
    backgroundColor,
    bloom,
    bloomRadius,
    brightness,
    color,
    curvature,
    dpr,
    mouseReact,
    mouseStrength,
    noise,
    pixelation,
    rgbShift,
    scanlineFrequency,
    scanlineStrength,
    speed,
    fps,
    vignette,
    waveAmplitude,
    waveFrequency,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", ...style }}
    />
  );
}

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
      <section className="relative bg-[#0A0A0A] text-white overflow-hidden">
        <div className="absolute inset-0">
          <CRTWarp
            color="#DC2626"
            backgroundColor="#0A0A0A"
            speed={0.45}
            curvature={0.3}
            scanlineStrength={0.3}
            scanlineFrequency={180}
            waveAmplitude={0.28}
            waveFrequency={2.2}
            bloom={1.7}
            bloomRadius={1.1}
            noise={0.08}
            vignette={0.4}
            brightness={1.15}
            pixelation={1}
            rgbShift={0.012}
            mouseReact
            mouseStrength={0.4}
            dpr={1}
            fps={30}
            paused={false}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(60% 55% at 50% 40%, rgba(0,0,0,0.35), transparent 70%)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-neutral-100 pointer-events-none" />
        </div>

        <div className="relative px-6 pt-28 pb-24 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-red font-semibold tracking-widest uppercase text-sm mb-4"
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
            className="mt-6 max-w-2xl mx-auto text-white/70 text-lg sm:text-xl"
          >
            Modern laser marking, finishing, and cutting technology for denim, garments, and sublimation fabrics.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            transition={{ delayChildren: 0.5 }}
            className="mt-14 flex flex-wrap justify-center gap-10 sm:gap-16"
          >
            {[
              { value: String(list.length), label: "Systems" },
              { value: "2", label: "Global Brands" },
              { value: "4x", label: "Productivity Gain" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white">{stat.value}</div>
                <div className="mt-1 text-sm uppercase tracking-wider text-white/50">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
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
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
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