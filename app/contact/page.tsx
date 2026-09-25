"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Zap, Check, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

/* ------------------------------------------------------------------ */
/*  GhostFibers background (inlined — no separate file/import)        */
/* ------------------------------------------------------------------ */

const hexToRgb = (hex: string): [number, number, number] => {
  const value = hex.trim().replace(/^#/, "");
  const normalized =
    value.length === 3 ? value.replace(/./g, (channel) => channel + channel) : value;
  const match = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  if (!match) return [1, 1, 1];
  return [
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255,
  ];
};

const setColor = (uniform: { value: Float32Array }, hex: string) => {
  const color = hexToRgb(hex);
  uniform.value[0] = color[0];
  uniform.value[1] = color[1];
  uniform.value[2] = color[2];
};

const ghostVertex = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const ghostFragment = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uLayers;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uWaveSpeed;
uniform float uLayerSpeed;
uniform float uTwist;
uniform float uTwistFrequency;
uniform float uTwistSpeed;
uniform float uLineFrequency;
uniform float uLineSpacing;
uniform float uLineSharpness;
uniform float uGlowFalloff;
uniform float uGlowIntensity;
uniform float uBrightness;
uniform float uBlueBoost;
uniform float uVignette;
uniform float uGrain;
uniform float uRotationSpeed;
uniform float uLightMode;
uniform vec3 uLineColor;
uniform vec3 uGlowColor;

out vec4 fragColor;

#define MAX_LAYERS 10

mat2 rotate2d(float angle) {
  float sine = sin(angle);
  float cosine = cos(angle);
  return mat2(cosine, -sine, sine, cosine);
}

float grainHash(vec2 point) {
  point = floor(point);
  float hash = 52.9829189 * fract(dot(point, vec2(0.065, 0.005)));
  return fract(hash);
}

float layeredGrain(vec2 fragmentPixel) {
  vec2 point = mod(fragmentPixel + vec2(uTime * 30.0, -uTime * 21.0), 1024.0);
  vec2 rotated = mat2(0.8, -0.5, 0.5, 0.8) * point;
  float grain = 0.0;
  grain += 0.40 * grainHash(rotated);
  grain += 0.25 * grainHash(rotated * 2.0 + 17.0);
  grain += 0.20 * grainHash(rotated * 4.0 + 47.0);
  grain += 0.10 * grainHash(rotated * 8.0 + 113.0);
  grain += 0.05 * grainHash(rotated * 16.0 + 191.0);
  return grain;
}

void main() {
  vec2 resolution = max(uResolution, vec2(1.0));
  vec2 uv = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;
  float time = uTime * uSpeed;
  /* Light-mode backdrop: light grey instead of white/black */
  vec3 backdrop = mix(vec3(0.070588, 0.058824, 0.090196), vec3(0.945, 0.945, 0.945), step(0.5, uLightMode));
  vec3 centerTone = max(uLineColor * 0.85567 - uGlowColor * 0.06186, vec3(0.0));
  vec3 cloudTone = uLineColor * 0.19588 + uGlowColor * 0.2268;
  vec2 p = uv;
  p /= max(uScale, 0.05);
  p = rotate2d(radians(uRotation) + time * uRotationSpeed) * p;
  vec3 color = vec3(0.0);
  float fiberField = 0.0;

  for (int index = 0; index < MAX_LAYERS; index++) {
    float fi = float(index) + 1.0;
    if (fi > uLayers) break;

    p += uWaveAmplitude * sin(p.yx * fi * uWaveFrequency + time * (uWaveSpeed + fi * uLayerSpeed));

    float radius = length(p);
    float polarAngle = atan(p.y, p.x);
    polarAngle += sin(radius * uTwistFrequency - time * uTwistSpeed + fi) * uTwist;
    p = vec2(cos(polarAngle), sin(polarAngle)) * radius;

    float lines = abs(sin(p.x * (uLineFrequency + fi * uLineSpacing) + sin(p.y * 3.0 + time)));
    lines = pow(max(0.0, 1.0 - lines), uLineSharpness);
    fiberField += lines / fi;
    color += uLineColor * lines / fi;

    float glow = exp(-uGlowFalloff * abs(sin(p.x * 3.0 + time + fi)));
    color += uGlowColor * glow * uGlowIntensity / (fi * 2.0);
  }

  float center = exp(-2.2 * dot(uv, uv));
  color += centerTone * center;

  float cloud = exp(-1.5 * length(uv + vec2(sin(time * 0.3) * 0.25, cos(time * 0.25) * 0.18)));
  color += cloudTone * cloud;

  float vignette = 1.0 - smoothstep(0.35, 1.45, length(uv));
  color *= mix(1.0 - uVignette, 1.0, vignette);
  color = 1.0 - exp(-color * uBrightness);
  color.b *= uBlueBoost;

    vec3 outputColor;
  if (uLightMode > 0.5) {
    float edgeFade = mix(1.0 - uVignette, 1.0, vignette);
    float fibers = pow(clamp(fiberField, 0.0, 1.0) * edgeFade, 0.6);
    float atmosphere = (center * 0.025 + cloud * 0.015) * edgeFade;
    vec3 fiberInk = uLineColor;
    vec3 airColor = mix(backdrop, uGlowColor, 0.16);

    outputColor = mix(backdrop, airColor, atmosphere);
      outputColor = mix(outputColor, fiberInk, clamp(fibers * 0.4, 0.0, 1.0));
  } else {
    outputColor = backdrop + color;
  }

  float noise = (layeredGrain(gl_FragCoord.xy) - 0.5) * uGrain;
  outputColor = clamp(outputColor + noise, 0.0, 1.0);
  fragColor = vec4(outputColor, 1.0);
}
`;

const ghostContexts = new WeakMap<HTMLDivElement, any>();

type GhostFibersProps = {
  lineColor?: string;
  glowColor?: string;
  speed?: number;
  scale?: number;
  rotation?: number;
  rotationSpeed?: number;
  layers?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  waveSpeed?: number;
  layerSpeed?: number;
  twist?: number;
  twistFrequency?: number;
  twistSpeed?: number;
  lineFrequency?: number;
  lineSpacing?: number;
  lineSharpness?: number;
  glowFalloff?: number;
  glowIntensity?: number;
  brightness?: number;
  blueBoost?: number;
  vignette?: number;
  grain?: number;
  lightMode?: boolean;
  dpr?: number;
  fps?: number;
  paused?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

function GhostFibers({
  lineColor = "#140E35",
  glowColor = "#3437A0",
  speed = 0.2,
  scale = 2,
  rotation = 0,
  rotationSpeed = 0.25,
  layers = 4,
  waveAmplitude = 0.015,
  waveFrequency = 3,
  waveSpeed = 0.15,
  layerSpeed = 0.08,
  twist = 0.1,
  twistFrequency = 5,
  twistSpeed = 1.2,
  lineFrequency = 5,
  lineSpacing = 2,
  lineSharpness = 16,
  glowFalloff = 10,
  glowIntensity = 1.6,
  brightness = 2,
  blueBoost = 1.25,
  vignette = 0.8,
  grain = 0.05,
  lightMode = false,
  dpr = 1,
  fps = 60,
  paused = false,
  style,
  className = "",
}: GhostFibersProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: false,
      antialias: false,
      dpr: Math.min(Math.max(dpr, 0.5), 2),
    });
    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: ghostVertex,
      fragment: ghostFragment,
      uniforms: {
        uResolution: { value: new Float32Array([1, 1]) },
        uTime: { value: 0 },
        uSpeed: { value: 0.2 },
        uScale: { value: 2 },
        uRotation: { value: 0 },
        uRotationSpeed: { value: 0.25 },
        uLayers: { value: 4 },
        uWaveAmplitude: { value: 0.015 },
        uWaveFrequency: { value: 3 },
        uWaveSpeed: { value: 0.15 },
        uLayerSpeed: { value: 0.08 },
        uTwist: { value: 0.1 },
        uTwistFrequency: { value: 5 },
        uTwistSpeed: { value: 1.2 },
        uLineFrequency: { value: 5 },
        uLineSpacing: { value: 2 },
        uLineSharpness: { value: 16 },
        uGlowFalloff: { value: 10 },
        uGlowIntensity: { value: 1.6 },
        uBrightness: { value: 2 },
        uBlueBoost: { value: 1.25 },
        uVignette: { value: 0.8 },
        uGrain: { value: 0.05 },
        uLightMode: { value: 0 },
        uLineColor: { value: new Float32Array(hexToRgb("#140E35")) },
        uGlowColor: { value: new Float32Array(hexToRgb("#3437A0")) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    let frameId = 0;
    let elapsed = 0;
    let previousTime = performance.now();
    let lastRenderTime = 0;
    let frameRate = 60;
    let isPaused = false;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const render = () => renderer.render({ scene: mesh });
    const stop = () => {
      if (frameId !== 0) cancelAnimationFrame(frameId);
      frameId = 0;
    };
    const canAnimate = () => isVisible && isPageVisible && !isPaused && !reducedMotion.matches;

    const loop = (now: number) => {
      frameId = 0;
      if (!canAnimate()) return;

      const delta = Math.min((now - previousTime) / 1000, 0.1);
      previousTime = now;
      elapsed += delta;

      if (now - lastRenderTime >= 1000 / frameRate - 0.5) {
        program.uniforms.uTime.value = elapsed;
        render();
        lastRenderTime = now;
      }

      frameId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!canAnimate() || frameId !== 0) return;
      previousTime = performance.now();
      frameId = requestAnimationFrame(loop);
    };

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
      render();
    };

    const handleVisibility = () => {
      isPageVisible = !document.hidden;
      if (canAnimate()) start();
      else stop();
    };
    const handleReducedMotion = () => {
      if (canAnimate()) start();
      else {
        stop();
        render();
      }
    };

    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (canAnimate()) start();
        else stop();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", handleReducedMotion);

    ghostContexts.set(container, {
      renderer,
      program,
      mesh,
      render,
      setPaused(value: boolean) {
        isPaused = value;
        if (canAnimate()) start();
        else {
          stop();
          render();
        }
      },
      setFps(value: number) {
        frameRate = Math.min(Math.max(value, 1), 120);
      },
    });

    setSize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", handleReducedMotion);
      ghostContexts.delete(container);
      if (canvas.parentNode === container) container.removeChild(canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dpr]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const context = ghostContexts.get(container);
    if (!context) return;

    const uniforms = context.program.uniforms;
    setColor(uniforms.uLineColor, lineColor);
    setColor(uniforms.uGlowColor, glowColor);
    uniforms.uSpeed.value = speed;
    uniforms.uScale.value = scale;
    uniforms.uRotation.value = rotation;
    uniforms.uRotationSpeed.value = rotationSpeed;
    uniforms.uLayers.value = Math.min(Math.max(Math.round(layers), 1), 10);
    uniforms.uWaveAmplitude.value = waveAmplitude;
    uniforms.uWaveFrequency.value = waveFrequency;
    uniforms.uWaveSpeed.value = waveSpeed;
    uniforms.uLayerSpeed.value = layerSpeed;
    uniforms.uTwist.value = twist;
    uniforms.uTwistFrequency.value = twistFrequency;
    uniforms.uTwistSpeed.value = twistSpeed;
    uniforms.uLineFrequency.value = lineFrequency;
    uniforms.uLineSpacing.value = lineSpacing;
    uniforms.uLineSharpness.value = lineSharpness;
    uniforms.uGlowFalloff.value = glowFalloff;
    uniforms.uGlowIntensity.value = glowIntensity;
    uniforms.uBrightness.value = brightness;
    uniforms.uBlueBoost.value = blueBoost;
    uniforms.uVignette.value = vignette;
    uniforms.uGrain.value = grain;
    uniforms.uLightMode.value = lightMode ? 1 : 0;
    context.setFps(fps);
    context.setPaused(paused);
    context.render();
  }, [
    lineColor,
    glowColor,
    speed,
    scale,
    rotation,
    rotationSpeed,
    layers,
    waveAmplitude,
    waveFrequency,
    waveSpeed,
    layerSpeed,
    twist,
    twistFrequency,
    twistSpeed,
    lineFrequency,
    lineSpacing,
    lineSharpness,
    glowFalloff,
    glowIntensity,
    brightness,
    blueBoost,
    vignette,
    grain,
    lightMode,
    fps,
    paused,
    dpr,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Contact page                                                      */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
} as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
} as const;

const fieldVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
} as const;

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactPage() {
  const { phones, emails, address } = useSiteSettings();

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    interest: "Sewing",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          interest: form.interest,
          message: form.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setStatus("success");
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        interest: "Sewing",
        message: "",
      });
    } catch (err) {
      console.error("EmailJS send failed:", err);
      setStatus("error");
    }
  }

    return (
    <div className="flex-1 relative overflow-hidden">
      {/* GhostFibers background: light grey backdrop, red fibers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
               <GhostFibers
          lineColor="#DC2626"
          glowColor="#F87171"
          speed={0.2}
          scale={2}
          rotation={0}
          rotationSpeed={0.25}
                   layers={4}
          waveAmplitude={0.015}
          waveFrequency={3}
          waveSpeed={0.15}
          layerSpeed={0.08}
          twist={0.1}
          twistFrequency={5}
          twistSpeed={1.2}
          lineFrequency={5}
          lineSpacing={2}
          lineSharpness={10}
          glowFalloff={10}
          glowIntensity={1.4}
          brightness={1.8}
          blueBoost={1}
          vignette={0.85}
          grain={0.05}
          dpr={1}
          lightMode={true}
          fps={60}
          paused={false}
        />
      </div>

                {/* Header */}
      <section className="relative z-10 text-center px-6 pt-28 pb-16">
        <div
          className="absolute inset-0 -z-10 bg-neutral-100/70 backdrop-blur-sm"
          aria-hidden="true"
        />
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block text-red text-sm font-semibold uppercase tracking-widest mb-4"
        >
          Let&apos;s talk
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-4xl sm:text-6xl font-bold text-black"
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 max-w-2xl mx-auto text-black/70 text-lg"
        >
          Have a question about our machinery or solutions? Send us a message
          and our team will get back to you.
        </motion.p>
      </section>

            {/* Form + Details */}
      <section className="relative z-10 px-6 pb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="md:col-span-3 bg-white rounded-2xl shadow-lg shadow-black/5 border border-black/5 p-8 sm:p-10"
            whileHover={{ boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)" }}
          >
            <motion.div variants={fieldVariant} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-black/10 bg-neutral-100 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-red/50 focus:scale-[1.01] transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-black mb-2">
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  placeholder="Your company"
                  className="w-full rounded-lg border border-black/10 bg-neutral-100 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-red/50 focus:scale-[1.01] transition-all duration-200"
                />
              </div>
            </motion.div>

            <motion.div variants={fieldVariant} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-black/10 bg-neutral-100 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-red/50 focus:scale-[1.01] transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+27 ..."
                  className="w-full rounded-lg border border-black/10 bg-neutral-100 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-red/50 focus:scale-[1.01] transition-all duration-200"
                />
              </div>
            </motion.div>

            <motion.div variants={fieldVariant} className="mt-6">
              <label htmlFor="interest" className="block text-sm font-medium text-black mb-2">
                I&apos;m interested in
              </label>
              <select
                id="interest"
                value={form.interest}
                onChange={(e) => update("interest", e.target.value)}
                className="w-full rounded-lg border border-black/10 bg-neutral-100 px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red/50 transition-all duration-200"
              >
                <option>Sewing</option>
                <option>Vibemac</option>
                <option>Maica</option>
                <option>Cutting</option>
                <option>Print</option>
                <option>Laundry</option>
                <option>CAD Pattern Design</option>
                <option>Laser Machines</option>
                <option>General Enquiry</option>
              </select>
            </motion.div>

            <motion.div variants={fieldVariant} className="mt-6">
              <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                required
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Tell us about your requirements..."
                className="w-full rounded-lg border border-black/10 bg-neutral-100 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-red/50 focus:scale-[1.01] transition-all duration-200 resize-none"
              />
            </motion.div>

            <motion.div variants={fieldVariant} className="mt-8 flex items-center gap-4">
              <motion.button
                type="submit"
                disabled={status === "sending"}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(214,40,40,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-10 py-3.5 bg-red text-white text-sm font-medium rounded-full hover:bg-black transition-colors duration-300 disabled:opacity-50"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </motion.button>

              {status === "success" && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-sm text-green-700"
                >
                  <Check size={16} /> Message sent — we&apos;ll be in touch soon.
                </motion.span>
              )}

              {status === "error" && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-sm text-red"
                >
                  <AlertCircle size={16} /> Something went wrong. Please try again.
                </motion.span>
              )}
            </motion.div>
          </motion.form>

          {/* Contact details */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="md:col-span-2 flex flex-col gap-6"
          >
            <motion.div
              variants={fieldVariant}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-black/5 p-8 transition-shadow duration-300"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-5">
                Contact
              </h3>
              {phones.length > 0 && (
                <div className="flex items-start gap-3 text-sm text-black/70 mb-6">
                  <Phone size={16} className="mt-0.5 shrink-0 text-red" />
                  <div className="space-y-1">
                    {phones.map((phone) => (
                      <div key={phone}>{phone}</div>
                    ))}
                  </div>
                </div>
              )}
              {emails.length > 0 && (
                <div className="flex items-start gap-3 text-sm text-black/70">
                  <Mail size={16} className="mt-0.5 shrink-0 text-red" />
                  <div className="space-y-1">
                    {emails.map((email) => (
                      <a
                        key={email}
                        href={"mailto:" + email}
                        className="block hover:text-red transition-colors"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {address && (
              <motion.div
                variants={fieldVariant}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-black/5 p-8 transition-shadow duration-300"
              >
                <h3 className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-5">
                  Visit us
                </h3>
                <div className="flex items-start gap-3 text-sm text-black/70 leading-relaxed">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-red" />
                  <p>{address}</p>
                </div>
              </motion.div>
            )}

            <motion.div
              variants={fieldVariant}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-black rounded-2xl p-8 text-white relative overflow-hidden"
            >
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-red/20 blur-2xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative flex items-center gap-2 mb-2">
                <Zap size={18} className="text-red" />
                <h3 className="text-lg font-semibold">Quick response</h3>
              </div>
              <p className="relative text-white/70 text-sm">
                We typically respond to enquiries within one business day.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}