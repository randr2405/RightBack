"use client";

import { motion } from "framer-motion";
import { Shirt, Repeat, Image as ImageIcon2, Sofa } from "lucide-react";

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

export default function VisionCutUseCases() {
  return (
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
  );
}