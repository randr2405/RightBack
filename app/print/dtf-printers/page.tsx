"use client";

import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";

const products = [
  {
    brand: "Linko",
    name: "DTF Linko L402",
    tagline: "A3 dual-head DTF printer with lifetime technical support",
    description: [
      "This is a new A3 DTF printer. Equipped with Epson i1600 dual-head high-speed printing. We offer ODM and OEM customization, worldwide supply, buying guide and lifetime technical support.",
    ],
    specs: [
      { label: "Print Head", value: "Epson i1600 dual head" },
      { label: "Print Width", value: "A3 | 33cm | 12 inches" },
      { label: "Print Speed", value: "2–3 m²/h" },
      { label: "Ink Type", value: "CMYK+W" },
    ],
    groups: [
      {
        label: "Top Features",
        items: [
          "Built-in powder shaker ensures even distribution of printed images",
          "Independent white ink recirculation system to prevent white ink clogging",
          "Supports colour printing to make products more attractive and unique",
          "The controller has a touch screen, which is user-friendly and improves productivity",
          "The front and rear arc-shaped heating platforms heat and adsorb to keep the media flat",
          "LED light functions to help operators view the printing process",
        ],
      },
    ],
  },
  {
    brand: "Linko",
    name: "DTF Linko KM-602",
    tagline: "Linko 2025 New DTF Printer — compact, precise, powerful",
    description: [
      "A new generation DTF printer combining a compact, space-saving footprint with dual print head options and a smart, automated feed and press system.",
    ],
    specs: [
      { label: "Print Width", value: "Up to 620mm (24.4 inches)" },
      { label: "Print Head Options", value: "Dual Epson i1600A1 or i3200A1" },
      { label: "Print Speed", value: "2–6 m²/h · 4–13 m²/h" },
      { label: "Ink Type", value: "CMYK+W" },
    ],
    groups: [
      {
        label: "Design Features",
        items: [
          "Compact and space-saving design fits any workspace",
          "Built-in print head moisturizing function ensures long-lasting operation with no additional costs",
          "Patented feed roller designed for ease of use and convenience",
          "Quiet dual-axis design enhances the working environment",
          "Includes a convenient computer stand and smart electric paper press for one-touch operation",
          "Transparent monitoring window for easy checking of print head status",
          "Precise lift mechanism ensures stable and consistent printing",
        ],
      },
    ],
  },
  {
    brand: "Linko",
    name: "UV DTF Linko UDY-402",
    tagline: "UV DTF printing — durable, high-resolution transfers",
    description: [
      "UV DTF (Direct-to-Film) printers differ from UV printers that print directly onto object surfaces. Instead, they use ultraviolet light to cure UV ink onto a film, and then transfer the pattern from the film to surfaces such as mugs, glass, and metal, resulting in durable, high-resolution prints quickly.",
    ],
    groups: [
      {
        label: "Features",
        items: [
          "Equipped with an Epson original authorized print head, with options for XP600 or 1600U1",
          "A compact desktop machine, offering an optional tripod for versatile usage",
          "Features a highly sensitive trolley collision avoidance system, coupled with an ink shortage alarm for enhanced safety and reliability",
          "Incorporates an electric-driven press paper mode and integrated electric laminating for streamlined operation",
          "Includes a standard AB Film Printing Solution, catering to a wide range of printing needs",
          "Compact in size yet packed with large energy, offering a space-saving solution without compromising on power",
        ],
      },
    ],
  },
  {
    brand: "Linko",
    name: "Digital Flatbed Cutter KFK-7090D",
    tagline: "Roll-fed flatbed cutter for DTF / UV DTF",
    description: [
      "A precision roll-fed flatbed cutting system built for DTF and UV DTF workflows, combining intelligent camera-guided cutting with strong vacuum adsorption and flexible connectivity.",
    ],
    groups: [
      {
        label: "Features",
        items: [
          "Intelligent Cutting System — high-speed servo motor, imported guide rails, and AI algorithms for fast and highly accurate cuts",
          "Real-Time Camera Positioning — automatically tracks complex contours with precision and stability, perfect for labels, packaging, and UV DTF graphics",
          "Lower Labour Costs — high-quality felt conveyor and fully automated feeding/cutting system, significantly reducing manual workload",
          "Strong Multi-Zone Vacuum Adsorption — keeps materials firmly in place with low noise and high suction power",
          "HD Touchscreen Control Panel — simple, intuitive operation with a bright LCD interface supporting multiple languages",
          "Dual Blade Switching — effortlessly alternate between half-cut and full-cut modes",
          "Flexible Connectivity — supports USB, USB flash drive, and Ethernet",
        ],
      },
      {
        label: "Advantages",
        items: [
          "Stronger carriage — controls cutting accuracy",
          "High precision steel axes — accurate, error-free paper feeding",
          "Bespoke paper feeding pinch roller with high temperature and wear resistance, long service life",
          "More interfaces: USB / U Disk / Serial port for convenient operation",
        ],
      },
    ],
  },
];

export default function DTFPrintersPage() {
  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Print"
        title="DTF Printers"
        ghostWord="LINKO"
        description="Direct-to-film and UV DTF printing systems, plus precision flatbed cutting — built for high-quality, high-volume garment decoration."
        stats={[
          { value: "4", label: "Systems" },
          { value: "A3", label: "To Wide Format" },
        ]}
      />

      <section>
        {products.map((product, i) => (
          <ProductCard key={product.name} index={i + 1} {...product} />
        ))}
      </section>
    </div>
  );
}