"use client";

import { motion } from "framer-motion";
import { Shirt, Repeat, Image as ImageIcon2, Sofa } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";

const products = [
  {
    brand: "Gemini",
    name: "Creative Studio",
    tagline: "One App, Countless Possibilities",
    description: [
      "Creative STUDIO is an advanced application for pattern design and full product development, covering standard, day-by-day tasks and challenging needs. It allows different configurations, suitable for various use cases or line of products, from fashion and apparel to furniture upholstery, from technical products and workwear to home deco accessories.",
    ],
    moreInfo: [
      "High Automation for Better Products in Less Time — Reduce time, effort, and risk of errors with Creative STUDIO's innovative features for pattern making and grading, for measurement and dimension management, for model traceability, or for working with repetitive motifs fabrics. Enhance product quality with efficient checking tools and by generating complete technical specifications, linked in real time with the CAD project.",
      "Help Each Client Feel Unique — Use Creative STUDIO's functionalities for style, size or print customization and prepare your models for suiting specific choices. Embrace human body variety and easily develop products using complex sizing system.",
      "Whoever You Are, We Serve — Through versatility, efficiency and excellent value for money, Creative STUDIO is the perfect choice for any growing business stepping towards digitalization and seeking for a performant CAD solution — from brands to manufacturing suppliers or freelance patternmakers.",
    ],
  },
  {
    brand: "Gemini",
    name: "Digitiser Expert",
    tagline: "Fast and Simple Digitization, With Best Accuracy",
    description: [
      "Digitizer EXPERT is the perfect solution for any industry or sector that requires digitization of cardboard patterns. It is compatible with smartphone camera or web camera, recommended for medium and small sized patterns which are commonly used in fashion industry, or with high-resolution camera, fit for big size patterns usually used in furniture upholstery.",
      "Enjoy high ergonomics and intuitiveness! You can uncover the secrets of this friendly app in the blink of an eye...",
    ],
    groups: [
      {
        label: "1Digitize",
        items: [
          "Enjoy a 5-minute setup and a productivity of up to 60 cardboard patterns digitized/hour, using the Mobile Digitizer module and smartphone camera",
          "Any flat surface, horizontal or vertical, can become your digitizing background",
          "Pictures are instantly loaded into your desktop app via cloud and automatically converted into digital files",
        ],
      },
      {
        label: "Detect",
        items: [
          "Through powerful auto-recognition capabilities, the app automatically detects piece contours and key grading points, as well as notches, internal points, and internal axes",
        ],
      },
      {
        label: "Check & Edit",
        items: [
          "Check the technical elements or create new ones",
          "Perform measurements between elements or on contour perimeters",
          "Edit the properties of pieces or selected elements (point, segment, internal line, internal point)",
        ],
      },
    ],
  },
  {
    brand: "Gemini",
    name: "Automart",
    tagline: "Instant Savings With Sustainable Technology",
    description: [
      "GEMINI AutomART® reinvents the workflow for decorated apparel businesses and empowers you to make significant savings every step of the way, from product development, to applying decorations and manufacturing. With intuitive and efficient tools and features, you will cut down the decorating time by 60%, while saving up to 30% on raw materials, consumables and the pre-sewing manufacturing time. AutomART® can drastically improve yield and productivity to boost the decorated apparel businesses for Digital Printing, Laser Engraving and Digital Embroidery.",
    ],
    groups: [
      {
        label: "Smart Design",
        items: [
          "Import graphical elements as PDF or Adobe Illustrator native files and manage artwork on your patterns with fashion-specific functions",
          "Automatically place, reposition, and grade artwork for the entire size set, for coherent design across all sizes",
          "Automatically align graphical elements across seams or zippers for a perfect match between assembled parts",
        ],
      },
      {
        label: "Manufacturing Yield",
        items: [
          "Automatic optimized best-efficiency markers with print PDF and cut files generated automatically",
          "Registration marks or outlines added automatically to optimize cutting",
          "Long markers auto-managed for RIP software processing",
          "Color information preserved from imported PDF/AI files for direct-to-fabric and transfer printing",
        ],
      },
    ],
  },
  {
    brand: "Gemini",
    name: "Planner Expert",
    tagline: "Complex Optimization Tool in the Cutting Room",
    description: [
      "Get highly efficient automatic cut planning in a fast and comfortable way. You can plan all the fabrics at once (main, lining, fusing, etc.), check multiple planning alternatives until choosing the best one, export all the production files at once.",
    ],
    groups: [
      {
        label: "Capabilities",
        items: [
          "Plan all fabrics at once — main, lining, fusing",
          "Check multiple planning alternatives before choosing",
          "Export all production files at once",
          "Increased speed for high order and marker volumes",
          "Full cost visibility — fabric, machinery, labor, energy",
          "Identify new solutions to optimize your budget",
        ],
      },
    ],
  },
  {
    brand: "Gemini",
    name: "Next Expert",
    tagline: "Fast & Highly Efficient Markers for Any Use Case",
    description: [
      "Based on our renowned proprietary algorithm, perform fully automatic, fast and high efficiency marker nesting optimization in apparel, upholstery, technical textiles, digital printing and other industries, saving fabrics while obeying various nesting rules and restrictions.",
    ],
    groups: [
      {
        label: "Capabilities",
        items: [
          "Solves piece grouping, fusing blocks, and alignment",
          "Handles color shading and fabric defects",
          "Visualize and validate plaid/check matching on-screen",
          "Imposition and nesting for ready-to-print PDF or AI files",
          "Saves fabric, transfer paper, ink, and time",
          "Preserves color management info perfectly",
        ],
      },
    ],
  },
  {
    brand: "Gemini",
    name: "Cut Collect",
    tagline: "Fast & Highly Efficient Markers for Any Use Case",
    description: [
      "Based on our renowned proprietary algorithm, perform fully automatic, fast and high efficiency marker nesting optimization in apparel, upholstery, technical textiles, digital printing and other industries, saving fabrics while obeying various nesting rules and restrictions.",
    ],
    groups: [
      {
        label: "Capabilities",
        items: [
          "Solves piece grouping, fusing blocks, and alignment",
          "Handles color shading and fabric defects",
          "Visualize and validate plaid/check matching on-screen",
          "Imposition and nesting for ready-to-print PDF or AI files",
          "Saves fabric, transfer paper, ink, and time",
          "Preserves color management info perfectly",
        ],
      },
    ],
  },
  {
    brand: "Gemini",
    name: "Vision Collect",
    tagline: "Next-Generation Optical Recognition for CNC Cutting",
    description: [
      "VisionCUT® is replacing the use of old generation optical recognition systems (camera on head) in CNC cutting applications such as mark recognition or repetitive motifs and is also extending to new applications such as on-the-fly contour recognition or skew & bow distort compensation, which were previously not covered by old technology.",
      "The main difference is that VisionCUT is scanning the entire surface of the fabric, thus being able to identify the entire geometry and distortion of the printed elements.",
    ],
  },
];

const useCases = [
  {
    icon: Shirt,
    title: "Sportsware & Shaped Printed Textiles",
    description:
      "Custom made sportswear is a booming business, with volumes growing every year. Despite the large volume, production is actually made-to-measure and atomized into small lots. The optimal production method in terms of cost and productivity is to custom-print the roll fabric and to cut the parts using VisionCUT® after printing. VisionCUT® will perfectly compensate the distortion of the elastic fabrics used for this type of products.",
  },
  {
    icon: Repeat,
    title: "Repetitive Motifs For Garments",
    description:
      "Fabrics with floral or other repetitive motifs are now handled perfectly by the optical recognition algorithm of VisionCUT®, making possible to create a fully automated cutting system with high output volume and perfect matching. Even the smallest repetitive details like a small logo faded on the background will be identified.",
  },
  {
    icon: ImageIcon2,
    title: "Advertising & Packaging",
    description:
      "Cutting a large feather flag on contour has never been easier. Using the total surface scan, VisionCUT® will extract the contour of shapes and generate a cut file on-the-fly, without need a pre-existing vector file.",
  },
  {
    icon: Sofa,
    title: "Stripes & Plaids For Furniture And Garments",
    description:
      "There are at least two significant advantages when cutting stripes and plaids with VisionCUT®: speed of process and capability to compensate bow & skew distortion by reshaping the cut parts to match perfectly the lines on the fabric.",
  },
];

export default function CADPatternDesignPage() {
  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Digital Design & Cutting"
        title="CAD Pattern Design"
        ghostWord="GEMINI"
        description="A complete digital suite for pattern making, digitization, marker planning, and precision cutting — from design to production."
        stats={[
          { value: "7", label: "Software Tools" },
          { value: "60%", label: "Faster Development" },
          { value: "30%", label: "Material Savings" },
        ]}
      />

      <section>
        {products.map((product, i) => (
          <ProductCard key={product.name} index={i + 1} {...product} />
        ))}
      </section>

      <section className="px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-red text-xs font-semibold uppercase tracking-widest mb-3 block">
              VisionCUT Applications
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-black">
              Where It&apos;s Used
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={useCase.title}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                  }}
                  whileHover={{ y: -6 }}
                  className="bg-neutral-100 rounded-2xl p-8 border border-black/5 hover:border-red/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-5">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-black/60 text-sm leading-relaxed">
                    {useCase.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}