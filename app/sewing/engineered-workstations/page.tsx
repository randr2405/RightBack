"use client";

import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";

const products = [
  {
    brand: "Bruce",
    name: "High Speed Electronic Straight Button Holing Machine — BRC-T1790G",
    tagline: "Strong adaptability to knitted and woven fabrics, quick switch between two stitches.",
    groups: [
      {
        label: "Features",
        items: [
          "High adaptability for knitted material",
          "Bottom sewing, no patter deformation",
        ],
      },
    ],
  },
  {
    brand: "Bruce",
    name: "High Speed Computerized Bartacking Machine — BRC-T1900GSK",
    tagline: "One minute quick change from Bartacking to Button attaching. One machine two functions.",
    groups: [
      {
        label: "Features",
        items: [
          "Bartacking and button attaching easy to shift",
          "Heavy duty can be sewing smoothly",
        ],
      },
    ],
  },
  {
    brand: "Bruce",
    name: "No-skip Computerized Eyelet Button-holing Machine — BRC-T9820G",
    tagline: "One minute quick change from Bartacking to Button attaching. One machine two functions.",
    groups: [
      {
        label: "Features",
        items: [
          "Perfect hooking technology",
          "High-precision imported machine tools",
          "Double hook thread clamping technology",
        ],
      },
    ],
  },
  {
    brand: "Bruce",
    name: "Electromechanical Button Attaching Machine — BRC-T373G",
    tagline: "One minute quick change from Bartacking to Button attaching. One machine two functions.",
    groups: [
      {
        label: "Features",
        items: [
          "Perfect hooking technology",
          "High-precision imported machine tools",
          "Double hook thread clamping technology",
        ],
      },
    ],
  },
];

export default function EngineeredWorkstationsPage() {
  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Sewing"
        title="Engineered Workstations"
        ghostWord="BRUCE"
        description="Buttonhole and Buttonsew Machines"
        stats={[
          { value: "4", label: "Machines" },
          { value: "CN", label: "Manufactured" },
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