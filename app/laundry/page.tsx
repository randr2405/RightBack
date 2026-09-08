"use client";

import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";

const products = [
  {
    brand: "Yilmak",
    name: "Ecogreen EG-D Garment Dyeing Machines",
    tagline: "50 years of garment dyeing expertise, reimagined",
    description: [
      "50 years of experience in garment dyeing in Yılteks guided us to create the HBM-D series Garment Dyeing Machines. By 2021 this legendary dyeing machine is evolving to a state of the art technology with the help of Yilmak's patented pump less water circulation system.",
      "Patented Water Circulation System of ECOGREEN-D Garment Dyeing Machines saves an important amount of water and chemicals. ECOGREEN-D Dyeing Machines provide perfect solutions for reactive dyeing, pigment dyeing, dischargeable dyeing, direct dyeing, and all other garment dyeing operations.",
    ],
  },
  {
    brand: "Yilmak",
    name: "Rainbow RB-D-05 Series Garment Dyeing Machines",
    tagline: "Decreased liquor ratio, healthier dyeing",
    description: [
      "Our brand new garment dyeing machine Rainbow allows dyeing at a decreased liquor ratio by the help of a second external drum which prevents the water in the machine leave the inner drum.",
      "The second external drum which covers the inner drum keeps the product inside water at all times. This both enables a healthier dyeing process and prevents outwearing of the product by decreasing friction. Rainbow dyeing machine is suitable for all kinds of dyeing.",
    ],
    moreInfo: [
      "Advantages — Reduced liquor ratio for lower water and chemical usage, decreased friction on garments, and a healthier, more even dyeing process suitable across dyeing types.",
    ],
  },
  {
    brand: "Yilmak",
    name: "Rainbow RB 25 HS-W Series High Speed Washing Machine",
    tagline: "Pump-free circulation, high speed extraction",
    description: [
      "Thanks to re-developed and re-designed pump free water circulation system, Rainbow HS machines are able to reach 1:2 / 1:3 liquor ratio for garment washing. Yılmak special 8 points individual balancing system enables RAINBOW HS-W to reach 400 G and high rotation speed during centrifuge hydro-extraction. Less handling cost and less damage risk for sensitive garments.",
      "Rainbow HS-W machines are also ready for JEANius or any other nebulising, nano bubble systems and ozone connection.",
    ],
  },
  {
    brand: "Yilmak",
    name: "Jeanius Finishing Systems",
    tagline: "Record-holding chemical spray distribution",
    description: [
      "This great engineering product always helps us to go one step ahead of others. It's an all-time record holder of most homogeneous chemical spray distribution on the garments.",
    ],
  },
  {
    brand: "Yilmak",
    name: "Brushing Robots & Other Dry Process Equipments",
    tagline: "Creating fashion, easier and faster",
    description: [
      "With Yılmak dry process equipments, creating fashion is easier and faster. Vacuum 3D Crinkle Machines, Octopus 3D wrinkle Machines, Horizontal Brushing & Scrapping Robots, Vertical Brushing & Scrapping Robots, Jacket Brushing & Scrapping Robots.",
    ],
  },
  {
    brand: "Yilmak",
    name: "HNS & HNS-ECO Series Tumbler Dryers",
    tagline: "Lowest energy consumption, flexible power sources",
    description: [
      "HNS Series Dryers are designed for the lowest energy consumption, they can be equipped with different kinds of energy sources such as steam, thermal oil, electricity, natural gas, and diesel.",
      "PLC, touch screen, humidity controller, conventional temperature controller, IR temperature controller, softener sprayer and steam sprayer are all our team members which help us run this perfect machine smoothly.",
      "We designed different machines for different working principles: Single Door & Single (Front) Tilting Machines, Pass-Through Machines Double Door Single Tilting (Back) with Automatic Loading and Conveyor Auto unloading systems.",
    ],
    benefits: [
      "New generation close circuit turbo system",
      "Up to 50% energy saving",
      "Lower steam consumption",
      "Lower electricity consumption",
    ],
  },
  {
    brand: "Yilmak",
    name: "HKR Series Carousel-Conveyor & HI 102 Spraying Cabinets",
    tagline: "Precision spraying for the final look",
    description: [
      "The sprayer on a garment is very important for the final look. We developed different kinds of spraying solutions such as Spraying Cabinets from 1 to 6 mannequin systems and HKR 12 Carousel System with 12 mannequins and HKR 24 Conveyor System with 24 mannequins.",
    ],
  },
  {
    brand: "Yilmak",
    name: "RF400 Rainforest Washing Machine",
    tagline: "A new chapter for garment washing",
    description: [
      "Rainforest technology; we opened a new chapter for garment washing industry. Thanks to our worldwide patented design which is reducing the usage of resources such as water, steam, chemical and providing shorter process time, meanwhile increasing the efficiency.",
      "Daily production outcome is 50%–70% higher as compared to conventional front loading washing machines.",
    ],
  },
  {
    brand: "Yilmak",
    name: "HG120 HG Series Hydro Extractors",
    tagline: "543 G of centrifugal force",
    description: [
      "An F16 Fighter Aircraft can apply a maximum of 12 G on its pilot at a speed of 2000 km/h, whereas a HG120 Centrifuge Hydro Extractor can apply 543 G on a wet garment. With this high level of centrifugal force, the damp level of the garment can be dramatically decreased and garments will be ready for a shorter drying process.",
      "In addition, the quick load dual basket cartridge load system dramatically reduces time between load batches.",
    ],
  },
];

export default function LaundryPage() {
  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Wash, Dye & Finish"
        title="Laundry"
        ghostWord="YILMAK"
        description="Advanced garment dyeing, washing, drying, and finishing technology built on decades of engineering expertise."
        stats={[
          { value: "9", label: "Machine Lines" },
          { value: "70%", label: "Higher Output" },
          { value: "50%", label: "Energy Savings" },
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