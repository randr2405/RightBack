"use client";

import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";

const products = [
  {
    brand: "SEI Laser",
    name: "Flexi Denim",
    tagline: "The digital laser machine for jeans and garments finishing",
    description: [
      "Specifically designed for denim and fabric garments finishing, it replaces traditional methods of discoloration, abrasion, decoration, marking, engraving and cutting.",
    ],
    groups: [
      {
        label: "Features",
        items: [
          "High quality: shading and natural used effects and very accurate and precise decorations are possible",
          "Materials processable: denim and textiles (natural and synthetic)",
          "Productivity up to three times higher than that possible with conventional machines",
          "Optimisation of laser energy: guarantees a reduction of costs and consumption (thanks to less energy waste)",
          "Simplicity of use thanks to user-friendly Icaro Denim software interface that halves set-up times. The operations are simple and immediate",
          "Industry 4.0 Ready: full digital workflow integration",
        ],
      },
    ],
  },
  {
    brand: "SEI Laser",
    name: "Flexi Denim 2C",
    tagline: "The most flexible laser system of the Flexi Denim line.",
    description: [
      "Flexi Denim 2C has been specifically designed for the laser marking, printing and finishing of garments like blue jeans, trousers, T-shirts etc. and is able to substitute the traditional finishing operations such as discoloration, abrasion, decoration.",
      "Flexi Denim 2C is a complete modular and flexible system, suitable for all modern production and workflow needs.",
    ],
    moreInfo: [
      "The system is equipped with two conveyors that allow both a continuous workflow (used separately) and the finishing of extra-large size garments (working jointly).",
      "Flexi Denim 2C has a special laser preview, assisting the operator in production, facilitating even the most complicated garment positioning sequences.",
      "EnGenius software helps to create an extremely realistic 3D modeling preview of the final garment, by visualizing and enabling the design of all desired laser finishing effects (used looks, broken effects, perforations, designs and writings).",
      "Thanks to the special SEI Vero function it is possible to reach a true natural look of the denim garment with full environmental care.",
    ],
    groups: [
      {
        label: "Main Benefits",
        items: [
          "Safety and modularity for an extremely simple installation",
          "State-of-the art performances for maximum energy efficiency and simplified care",
          "Top productivity: up to 4 times more than traditional laser systems",
          "Finishing process dramatically reducing total water consumption",
          "Remote control and diagnostic module included",
          "Hi-resolution and natural effects with grey scale",
          "User-friendly software developed by SEI Laser: all steps intuitive and very simple",
          "Double conveyor for optimization of production lead times",
          "Smart manufacturing ready (Industry 4.0)",
        ],
      },
    ],
  },
  {
    brand: "SEI Laser",
    name: "Flexi Denim Flat",
    tagline: "The most compact laser solution for garments processing.",
    description: [
      "Flexi Denim FLAT has been specially designed for marking, printing and finishing garments such as blue jeans, trousers, t-shirts etc.",
      "Flexi Denim FLAT is able to replace some traditional finishing operations: discoloration, abrasion or decoration.",
    ],
    moreInfo: [
      "Flexi Denim FLAT is entirely modular and flexible, meaning that it is suitable for every modern production and workflow need. This system is equipped with two static areas that allow a continuous workflow and finishing of extra-large size garments.",
      "Flexi Denim FLAT has a special laser preview to help the operator during production, facilitating even the most complicated garment placement sequences. The software, EnGenius, creates an extremely realistic 3D model preview of the finished garment, by visualizing the design of every desired laser effect (used look, broken effects, perforations, designs and writings). Thanks to SEI Vero function it is possible to reach a true natural look of the denim garment with full environmental care.",
    ],
    groups: [
      {
        label: "Main Benefits",
        items: [
          "Safety and modularity for an extremely simple installation",
          "Working area accessible from 3 sides",
          "Optical safety barriers and safety scanner for maximum safety",
          "State-of-the art performances for maximum energy efficiency and simplified care",
          "Top productivity: up to 4 times more than traditional laser systems",
          "Finishing process dramatically reducing total water consumption",
          "Remote control and diagnostic module included",
          "Hi-resolution and natural effects with grey scale",
          "User-friendly software: all steps intuitive and very simple",
          "Double static table for optimization of production lead times",
        ],
      },
    ],
  },
  {
    brand: "Golden Laser",
    name: "Visioncut",
    tagline:
      "Vision Scanning Laser Cutting Machine for Sublimation Fabric CJGV-160130LD / 190130LD / 160200LD",
    description: [
      "Golden Laser's Vision Laser Cutting Machine is ideal for cutting sublimation textile fabrics of all shapes and sizes. Cameras scan the fabric, detect and recognize printed contour, or read the registration marks and cut the chosen designs with speed and accuracy. A conveyor and auto-feeder is used to keep cutting continuous, saving time and increasing production speed.",
    ],
  },
  {
    brand: "Golden Laser",
    name: "Independent Dual Head Laser Cutting Machine",
    tagline:
      "Independent Dual Heads Laser Cutting Machine XBJGHY-1601OOLDII CJGV-160130LD / 190130LD / 160200LD",
    description: [
      "This laser cutting machine is equipped with two independent laser cutting heads on two tracks that can operate independently at the same time, supporting simultaneous cutting of different shapes. This setup allows for increased efficiency and productivity in laser cutting operations.",
    ],
  },
  {
    brand: "Golden Laser",
    name: "General Purpose Laser Cutting Machine",
    tagline: "General-purpose Laser Cutting Machine",
    description: ["Small format CO2 laser cutting machine."],
    groups: [
      {
        label: "Working Areas",
        items: [
          "1000×600mm",
          "1300×900mm",
          "1400×900mm",
          "1600×1000mm",
          "1800×1000mm",
        ],
      },
    ],
  },
];

export default function LaserMachinesPage() {
  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Precision Finishing"
        title="Laser Machines"
        ghostWord="LASER"
        description="Modern laser marking, finishing, and cutting technology for denim, garments, and sublimation fabrics."
        stats={[
          { value: "6", label: "Systems" },
          { value: "2", label: "Global Brands" },
          { value: "4x", label: "Productivity Gain" },
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