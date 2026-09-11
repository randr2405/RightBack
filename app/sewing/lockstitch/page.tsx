"use client";

import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";

const products = [
  {
    brand: "Bruce",
    name: "R4000",
    tagline: "No Break, No Skip, Use Tank 4000",
    description: [
      "The new tank feeding technology is adopted, the feeding track has a wide contact area, and the cloth feeding is more effective. Combined with a new generation of high-torque motor, it can realize super strong cloth feeding without slipping, at the same time with smooth stem passing and needles without fluttering.",
    ],
    groups: [
      {
        label: "Features",
        items: [
          "Tank feeding technology",
          "High torque motor",
          "Uninterrupted line while passing the stalk continuously",
          "Sew loops on trousers",
          "Sew a zipper",
          "Sew the crotch",
          "Sew pockets",
        ],
      },
    ],
  },
  {
    brand: "Bruce",
    name: "R1000",
    tagline: "Faster trimming, smarter control",
    groups: [
      {
        label: "Features",
        items: [
          "Automatic trimming thread, efficiency increased by over 30%",
          "The operation panel is more intelligent",
        ],
      },
    ],
  },
  {
    brand: "Bruce",
    name: "R6F-E",
    tagline: "Computerized needle feeding lockstitch machine",
    groups: [
      {
        label: "Features",
        items: [
          "Needle feed, short thread, semi-dry, big space",
          "Feed smoothly, avoid layers offset",
          "Beautiful stitches without thread trail",
        ],
      },
    ],
  },
];

export default function LockstitchPage() {
  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Sewing"
        title="Lockstitch"
        ghostWord="BRUCE"
        description="Bruce has a strong expert research and development team and advanced design concepts, a scientific and rigorous management system and quality supervision system."
        stats={[
          { value: "3", label: "Machines" },
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