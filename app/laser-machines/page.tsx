"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

const products = [
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
    benefits: [
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
    benefits: [
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
    benefits: [
      "Working area: 1000×600mm",
      "Working area: 1300×900mm",
      "Working area: 1400×900mm",
      "Working area: 1600×1000mm",
      "Working area: 1800×1000mm",
    ],
  },
];

export default function LaserMachinesPage() {
  return (
    <div className="bg-neutral-100 flex-1">
      {/* Hero */}
      <section className="relative bg-black text-white text-center px-6 py-32 overflow-hidden">
        <motion.div
          className="absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-red/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block text-red text-sm font-semibold uppercase tracking-widest mb-4"
        >
          Precision Finishing
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative text-4xl sm:text-6xl lg:text-7xl font-bold"
        >
          Laser Machines
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative mt-6 max-w-2xl mx-auto text-white/70 text-lg"
        >
          Modern laser marking, finishing, and cutting technology for denim,
          garments, and sublimation fabrics.
        </motion.p>
      </section>

      {/* Product list */}
      <section>
        {products.map((product, i) => (
          <ProductCard key={product.name} index={i + 1} {...product} />
        ))}
      </section>
    </div>
  );
}