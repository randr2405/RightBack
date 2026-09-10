"use client";

import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";

const products = [
  {
    brand: "Cutting",
    name: "iSpread",
    tagline: "Automatic fabric relaxing control for high-stability spreading",
    description: [
      "Automatic fabric relaxing control: to relax the fabric in advance and release the tension during spreading the fabric. Easy using, high stability and high efficiency to ensure the quality of spreading. Angle adjustable bar with curve, for cloth expanded, applied on elastic fabric.",
    ],
    groups: [
      {
        label: "Features",
        items: [
          "None cloth stop function, start point auto returning",
          "Practical and concise appearance, low wind resistance, low noise, low vibration",
          "Automatic cloth feeding",
          "Imported PLC touch screen operation system",
        ],
      },
      {
        label: "Standard Configuration",
        items: [
          "Imported PLC touch screen operation system",
          "Intelligent cloth feeding drum device",
          "Imported auto cutting device",
          "Automatic tracking unwinding system",
          "Imported infrared edge control",
          "Automatic rising device",
          "Emergency stop safety device, auto cutting device",
          "Rewinding function (material roll)",
        ],
      },
      {
        label: "Option Configuration",
        items: [
          "Raise up spread height to 30cm — Double pull device / Hopper Feeding Device",
          "Cutting Knife Feeding Device",
          "Front Press Device",
          "Rear Press Device",
          "Fabric Folding Rod",
          "Single Pull Cutting Device",
          "Static Elimination Device (Electrostatic rod)",
          "Static Brush",
          "Fabric Support Device (Large Size) / Fabric Support Device (Small Size)",
          "Tension Adjustment Roller",
          "Photoelectric Anti-collision Device",
        ],
      },
    ],
  },
];

export default function SpreadingMachinePage() {
  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Cutting"
        title="Spreading Machine"
        ghostWord="SPREAD"
        description="High-stability automatic fabric spreading with intelligent tension control, built for consistent quality at speed."
        stats={[
          { value: "1", label: "System" },
          { value: "11", label: "Optional Modules" },
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