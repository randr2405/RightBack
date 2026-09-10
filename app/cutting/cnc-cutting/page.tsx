"use client";

import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";

const products = [
  {
    brand: "Cutting",
    name: "iCut",
    tagline: "High-precision multi-functional CNC cutting",
    description: [
      "High-precision multi-functional CNC cutting machines specially developed for mass production. This series of cutting machine is suitable for the garment industry, shoes and hats industry, luggage industry, automotive interior industry, home industry, sofa seat industry, plush toy industry, composite fabrics and other soft material cutting fields.",
      "After adsorption, it can reach standard thickness of 8cm. The cutting machine has excellent cutting speed and maintains the highest precision among the same type of cutting machine. It has excellent energy-saving, low-carbon and intelligent high-tech qualities.",
    ],
    benefits: [
      "Machine tool advantage: high transmission precision, high dimensional accuracy, good rigidity, stable start and stop, and stable transmission speed",
      "Operation advantage: Advanced module technology combined with intuitive touch technology for easy operation, automatic fault alarm function for easy diagnosis and treatment",
      "Software advantage: Integrated software with easy-to-use control methods and visual management system for multi-angle full-scale operation",
      "Cutting advantage: high cutting precision, no deformation, less lint, high efficiency",
      "Consumables advantage: Spin-type double-sided sharpening knife, can cut more than 10,000 pieces per day, long working time and high efficiency",
      "Standard: HAN Core blade intelligence 4.0 system",
      "Standard: Automatic covered film",
      "Standard: Five shafts double blade plate",
      "Standard: Frequency conversion vacuum system",
      "Standard: Dust-collection system",
      "Standard: Levitation blade",
      "Standard: Automatic blade sharpening",
      "Standard: Air cooling system",
      "Standard: 303 HAN Core blade",
      "Standard: Maintain partial vacuuming during advance",
      "Standard: Safety device",
      "Standard: Spindle synchronous drive",
      "Standard: Film unfolding assistance",
      "Optional: Max cutting height 11cm",
      "Optional: Hollow punching device",
      "Optional: Solid punching device",
      "Optional: Moving system",
      "Optional: Automatic lubrication oil cooling system",
    ],
  },
  {
    brand: "Cutting",
    name: "Multilayer Template Cutting Machine HB-1512CS",
    tagline: "Precision multilayer cutting up to 8mm thickness",
    description: [
      "A robust multilayer template cutting machine designed for high-speed, high-precision cutting across a range of material stacks and custom specifications.",
    ],
    benefits: [
      "Can once cut 8mm thickness within the 1-5 layers template",
      "Gold partner Kimo 2020 template software",
      "Material fixed way: mechanical clamping",
      "Frame platform design and manufacture according to the standard of numerical control machine",
      "High speed, precision, no code, curve smooth without shaking",
      "Accept the bespoke specifications, the maximum cutting area can do 3000×1600mm",
    ],
  },
];

export default function CNCCuttingPage() {
  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Cutting"
        title="CNC Cutting"
        ghostWord="CNC"
        description="High-precision, multi-functional CNC cutting technology built for speed, accuracy, and mass production across industries."
        stats={[
          { value: "2", label: "Systems" },
          { value: "8cm", label: "Max Thickness" },
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