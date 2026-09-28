"use client";

import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
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

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uLightMode;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  if (uLightMode > 0.5) {
    float energy = clamp(max(intensity, 0.0), 0.0, 1.0);
    float coverage = clamp(auroraAlpha * (0.55 + 0.45 * energy), 0.0, 0.86);
    vec3 chroma = pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 0.0001);
    fragColor = vec4(mix(vec3(1.0), chroma, min(coverage * 1.08, 0.94)), 1.0);
  } else {
    fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
  }
}
`;

type AuroraProps = {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  speed?: number;
  time?: number;
  lightMode?: boolean;
};

function Aurora(props: AuroraProps) {
  const {
    colorStops = ["#5227FF", "#7cff67", "#5227FF"],
    amplitude = 1.0,
    blend = 0.5,
    lightMode = false,
  } = props;
  const propsRef = useRef(props);
  propsRef.current = props;

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    (gl.canvas as HTMLCanvasElement).style.backgroundColor = "transparent";

    let program: Program | undefined;

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    }
    window.addEventListener("resize", resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const colorStopsArray = colorStops.map((hex) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend },
        uLightMode: { value: lightMode ? 1 : 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas as HTMLCanvasElement);

    let animateId = 0;
    const update = (t: number) => {
      animateId = requestAnimationFrame(update);
      const { time = t * 0.01, speed = 1.0 } = propsRef.current;
      const p = program as Program;
      p.uniforms.uTime.value = time * speed * 0.1;
      p.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.0;
      p.uniforms.uBlend.value = propsRef.current.blend ?? blend;
      p.uniforms.uLightMode.value = (propsRef.current.lightMode ?? lightMode)
        ? 1
        : 0;
      const stops = propsRef.current.colorStops ?? colorStops;
      p.uniforms.uColorStops.value = stops.map((hex) => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });
      renderer.render({ scene: mesh });
    };
    animateId = requestAnimationFrame(update);

    resize();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas as HTMLCanvasElement);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude, blend, lightMode]);

  return <div ref={ctnDom} style={{ width: "100%", height: "100%" }} />;
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

export default function CNCCuttingPage() {
  const [list, setList] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const reduced = !!useReducedMotion();

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

  const { scrollYProgress: listProgress } = useScroll({
    target: listRef,
    offset: ["start end", "end end"],
  });
  const railScale = useSpring(listProgress, {
    stiffness: 100,
    damping: 25,
    mass: 0.3,
  });
  const railDotTop = useTransform(
    railScale,
    (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`
  );

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "cutting/cnc-cutting")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Failed to load CNC Cutting products:", error.message);
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
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Aurora
              colorStops={["#7F1D1D", "#DC2626", "#FCA5A5"]}
              blend={0.5}
              amplitude={1.0}
              speed={1}
            />
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 55% at 50% 40%, rgba(0,0,0,0.5), transparent 70%)",
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
              CNC Cutting
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
              High-precision, multi-functional CNC cutting technology built for
              speed, accuracy, and mass production across industries.
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
                { value: "8cm", label: "Max Thickness" },
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
                Loading CNC cutting systems…
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
                No CNC cutting systems available right now — check back soon.
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