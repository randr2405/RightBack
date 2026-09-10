"use client";

import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";

const products = [
  {
    brand: "Cutting",
    name: "ECON-1209",
    tagline: "Versatile sample cutting for garments, patterns, and rigid plates",
    description: [
      "A flexible sample cutting machine built to handle fabric, pattern, and clean-plate cutting across a wide range of materials — from Kraft paper and cardboard to PVC, ABS, and steel-backed board.",
    ],
    groups: [
      {
        label: "Features",
        items: [
          "Cutting sample garment — cutting all kinds of fabrics with DRT, optional EOT cutting composites",
          "Cutting pattern — uses DRT to cut pattern materials such as white cardboard and Kraft paper; optional EOT cuts pattern materials like white cardboard and Kraft paper; optional UCT cuts white cardboard, Kraft paper, and 5mm cardboard and other materials",
          "Cut the clean plate — shaped plate, wrap ironing plate; DRT cuts 0.5mm yellow plate (Epoxy resin board), 1.0mm PVC and other materials; optional UCT cuts 0.5mm yellow plate (Epoxy resin plate), 1.0mm PVC, etc.; optional EOT cuts 0.5mm yellow plate (Epoxy resin plate), 1.5mm PVC, 1.5mm ABS, 1.5mm steel cardboard, 5mm middle bottom plate and 5mm cardboard etc.",
        ],
      },
    ],
  },
];

export default function SampleCuttingMachinePage() {
  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Cutting"
        title="Sample Cutting Machine"
        ghostWord="SAMPLE"
        description="Precision sample cutting for garments, patterns, and rigid plate materials — one machine, multiple cutting modes."
        stats={[
          { value: "1", label: "System" },
          { value: "3", label: "Cutting Modes" },
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