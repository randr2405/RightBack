"use client";

import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";

const products = [
  {
    brand: "Print",
    name: "Pattern Marker Plotters — H9 Plotter",
    tagline: "Precision plotting with super long service life",
    description: [
      "The H9 Plotter combines a super large capacity cartridge with a piezoelectric type nozzle, built for reliability and longevity in high-volume pattern marker production.",
    ],
    groups: [
      {
        label: "Features",
        items: [
          "Super large capacity cartridge, piezoelectric type nozzle, and super long service life",
          "Nozzle, stable large ink cartridge, reduce the cost of consumables",
          "The new curved surface structure design, paper perfect fit, cutting, printing effect is more perfect",
          "Independent double pressure wheel structure, more accurate",
          "Han-Bond blade holder: 12 adjustable stalls, fast and convenient",
          "Han-Bond blade: Japanese OEM, service life is 3-10 times of the ordinary blade",
          "Automatic paper cutting: one key cuts paper, fast and convenient",
          "Servo motor drive, high precision, low noise, long life",
          "Double feeding system (white paper and Kraft paper)",
          "One-click set printing start point",
          "Paper Shortage Alarm and Auto Suspension",
          "Paper jam alarm and Automatic suspension",
          "Standby protection of nozzle and automatic cleaning mechanism, suitable for global climate including desert climate",
          "Set parameters online without downtime",
          "Automatic paper cutting when end of printing (END CUTTING)",
        ],
      },
    ],
    specs: [
      { label: "Nozzle column width", value: "EPSON 380 = 2×HP45 = 1 inch" },
      { label: "Maximum printing speed", value: "EPSON 380 = 5×HP45" },
      {
        label: "Ink cartridge capacity",
        value: "EPSON 380, 210ml/PCS = 5×HP45, 42ml/PCS",
      },
      {
        label: "Consumptive material cost",
        value: "EPSON 380 = 1/10–1/20×HP45",
      },
      {
        label: "Print head service life",
        value: "EPSON 380 = FOREVER · HP45 = one-off (7–14 days)",
      },
    ],
  },
  {
    brand: "Print",
    name: "Pattern Marker Board Cutter — H9",
    tagline: "Reliable cutting, matched to the H9 Plotter",
    description: [
      "The H9 Board Cutter shares the same reliable print and cutting technology as the H9 Plotter, delivering consistent, high-quality results across your full pattern marker workflow.",
    ],
    groups: [
      {
        label: "Features",
        items: [
          "Super large capacity cartridge, piezoelectric type nozzle, and super long service life",
          "Nozzle, stable large ink cartridge, reduce the cost of consumables",
          "The new curved surface structure design, paper perfect fit, cutting, printing effect is more perfect",
          "Independent double pressure wheel structure, more accurate",
          "Han-Bond blade holder: 12 adjustable stalls, fast and convenient",
          "Han-Bond blade: Japanese OEM, service life is 3-10 times of the ordinary blade",
          "Automatic paper cutting: one key cuts paper, fast and convenient",
          "Servo motor drive, high precision, low noise, long life",
          "Double feeding system (white paper and Kraft paper)",
          "One-click set printing start point",
          "Paper Shortage Alarm and Auto Suspension",
          "Paper jam alarm and Automatic suspension",
          "Standby protection of nozzle and automatic cleaning mechanism, suitable for global climate including desert climate",
          "Set parameters online without downtime",
          "Automatic paper cutting when end of printing (END CUTTING)",
        ],
      },
    ],
    specs: [
      { label: "Nozzle column width", value: "EPSON 380 = 2×HP45 = 1 inch" },
      { label: "Maximum printing speed", value: "EPSON 380 = 5×HP45" },
      {
        label: "Ink cartridge capacity",
        value: "EPSON 380, 210ml/PCS = 5×HP45, 42ml/PCS",
      },
      {
        label: "Consumptive material cost",
        value: "EPSON 380 = 1/10–1/20×HP45",
      },
      {
        label: "Print head service life",
        value: "EPSON 380 = FOREVER · HP45 = one-off (7–14 days)",
      },
    ],
  },
];

export default function PatternMarkerPlottersPage() {
  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Print"
        title="Pattern Marker Plotters"
        ghostWord="PLOT"
        description="High-precision plotting and cutting technology for accurate, cost-efficient pattern marker production."
        stats={[
          { value: "2", label: "Systems" },
          { value: "H9", label: "Series" },
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