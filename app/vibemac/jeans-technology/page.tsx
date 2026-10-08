"use client";

import { useRef, useEffect, useState, forwardRef } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { EffectComposer, wrapEffect } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import * as THREE from "three";
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

type RGB = [number, number, number];

const waveVertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`;

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec3 backgroundColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 4;
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p + fbm(p2)); 
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  float f = pattern(uv);
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.5 * effect;
  }
  vec3 col = mix(backgroundColor, waveColor, clamp(f, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}
`;

const ditherFragmentShader = `
precision highp float;
uniform float colorNum;
uniform float pixelSize;
const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

vec3 dither(vec2 uv, vec3 color) {
  vec2 scaledCoord = floor(uv * resolution / pixelSize);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
  float step = 1.0 / (colorNum - 1.0);
  color += threshold * step;
  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float bias = mix(0.2, 0.0, smoothstep(0.45, 0.8, luminance));
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

void mainImage(in vec4 inputColor, in vec2 uv, out vec4 outputColor) {
  vec2 normalizedPixelSize = pixelSize / resolution;
  vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
  vec4 color = texture2D(inputBuffer, uvPixel);
  color.rgb = dither(uv, color.rgb);
  outputColor = color;
}
`;

class RetroEffectImpl extends Effect {
  constructor() {
    const uniforms = new Map<string, THREE.Uniform>([
      ["colorNum", new THREE.Uniform(4.0)],
      ["pixelSize", new THREE.Uniform(2.0)],
    ]);
    super("RetroEffect", ditherFragmentShader, { uniforms });
  }
  set colorNum(v: number) {
    (this.uniforms.get("colorNum") as THREE.Uniform).value = v;
  }
  get colorNum(): number {
    return (this.uniforms.get("colorNum") as THREE.Uniform).value;
  }
  set pixelSize(v: number) {
    (this.uniforms.get("pixelSize") as THREE.Uniform).value = v;
  }
  get pixelSize(): number {
    return (this.uniforms.get("pixelSize") as THREE.Uniform).value;
  }
}

const WrappedRetro = wrapEffect(RetroEffectImpl) as unknown as React.ComponentType<any>;

const RetroEffect = forwardRef<unknown, { colorNum: number; pixelSize: number }>(
  (props, ref) => {
    const { colorNum, pixelSize } = props;
    return <WrappedRetro ref={ref} colorNum={colorNum} pixelSize={pixelSize} />;
  }
);
RetroEffect.displayName = "RetroEffect";

type DitheredWavesProps = {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  waveColor: RGB;
  backgroundColor: RGB;
  colorNum: number;
  pixelSize: number;
  disableAnimation: boolean;
  enableMouseInteraction: boolean;
  mouseRadius: number;
};

function DitheredWaves({
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  waveColor,
  backgroundColor,
  colorNum,
  pixelSize,
  disableAnimation,
  enableMouseInteraction,
  mouseRadius,
}: DitheredWavesProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const mouseRef = useRef(new THREE.Vector2());
  const { viewport, size, gl } = useThree();

  const waveUniformsRef = useRef({
    time: new THREE.Uniform(0),
    resolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
    waveSpeed: new THREE.Uniform(waveSpeed),
    waveFrequency: new THREE.Uniform(waveFrequency),
    waveAmplitude: new THREE.Uniform(waveAmplitude),
    waveColor: new THREE.Uniform(new THREE.Color(...waveColor)),
    backgroundColor: new THREE.Uniform(new THREE.Color(...backgroundColor)),
    mousePos: new THREE.Uniform(new THREE.Vector2(0, 0)),
    enableMouseInteraction: new THREE.Uniform(enableMouseInteraction ? 1 : 0),
    mouseRadius: new THREE.Uniform(mouseRadius),
  });

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const w = Math.floor(size.width * dpr),
      h = Math.floor(size.height * dpr);
    const res = waveUniformsRef.current.resolution.value;
    if (res.x !== w || res.y !== h) {
      res.set(w, h);
    }
  }, [size, gl]);

  const prevColor = useRef<number[]>([...waveColor]);
  const prevBackgroundColor = useRef<number[]>([...backgroundColor]);
  useFrame(({ clock }) => {
    const u = waveUniformsRef.current;

    if (!disableAnimation) {
      u.time.value = clock.getElapsedTime();
    }

    if (u.waveSpeed.value !== waveSpeed) u.waveSpeed.value = waveSpeed;
    if (u.waveFrequency.value !== waveFrequency)
      u.waveFrequency.value = waveFrequency;
    if (u.waveAmplitude.value !== waveAmplitude)
      u.waveAmplitude.value = waveAmplitude;

    if (!prevColor.current.every((v, i) => v === waveColor[i])) {
      u.waveColor.value.set(...waveColor);
      prevColor.current = [...waveColor];
    }

    if (!prevBackgroundColor.current.every((v, i) => v === backgroundColor[i])) {
      u.backgroundColor.value.set(...backgroundColor);
      prevBackgroundColor.current = [...backgroundColor];
    }

    u.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
    u.mouseRadius.value = mouseRadius;

    if (enableMouseInteraction) {
      u.mousePos.value.copy(mouseRef.current);
    }
  });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!enableMouseInteraction) return;
    const rect = gl.domElement.getBoundingClientRect();
    const dpr = gl.getPixelRatio();
    mouseRef.current.set(
      (e.clientX - rect.left) * dpr,
      (e.clientY - rect.top) * dpr
    );
  };

  return (
    <>
      <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={waveVertexShader}
          fragmentShader={waveFragmentShader}
          uniforms={waveUniformsRef.current}
        />
      </mesh>

      <EffectComposer>
        <RetroEffect colorNum={colorNum} pixelSize={pixelSize} />
      </EffectComposer>

      <mesh
        onPointerMove={handlePointerMove}
        position={[0, 0, 0.01]}
        scale={[viewport.width, viewport.height, 1]}
        visible={false}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

type DitherProps = {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: RGB;
  backgroundColor?: RGB;
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
};

function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  backgroundColor = [0, 0, 0],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
}: DitherProps) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%", position: "relative" }}
      camera={{ position: [0, 0, 6] }}
      dpr={1}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <DitheredWaves
        waveSpeed={waveSpeed}
        waveFrequency={waveFrequency}
        waveAmplitude={waveAmplitude}
        waveColor={waveColor}
        backgroundColor={backgroundColor}
        colorNum={colorNum}
        pixelSize={pixelSize}
        disableAnimation={disableAnimation}
        enableMouseInteraction={enableMouseInteraction}
        mouseRadius={mouseRadius}
      />
    </Canvas>
  );
}

const WAVE_COLOR: RGB = [0.863, 0.149, 0.149];
const BG_COLOR: RGB = [0.04, 0.04, 0.04];

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

export default function JeansTechnologyPage() {
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
  const bgY = useTransform(heroProgress, [0, 1], ["0%", "20%"]);
  const bgScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
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
        .eq("category", "vibemac/jeans-technology")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Failed to load Jeans Technology products:", error.message);
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
                 <div
            className="absolute inset-0 bg-cover bg-[position:85%_center] sm:bg-[position:center_80%]"
            style={{ backgroundImage: "url('/hero/jeans-technology-hero.png')" }}
          />
          <div className="absolute inset-0 bg-black/55 sm:bg-black/30" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-neutral-100 pointer-events-none" />
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
                   className="relative px-6 pt-28 pb-32 sm:pb-44 text-center pointer-events-none"
        >
          <motion.div style={reduced ? undefined : { y: eyebrowY }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[#DC2626] font-semibold tracking-widest uppercase text-sm mb-4"
            >
              Vibemac
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
              Jeans Technology
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
              Precision automation for denim production — from pocket setting and
              hemming to waistbands and specialty stitching.
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
                { value: String(list.length), label: "Machines" },
                { value: "IT", label: "Made in Italy" },
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
            Choose your machine
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
              Loading jeans technology machines…
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
              No jeans technology machines available right now — check back soon.
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