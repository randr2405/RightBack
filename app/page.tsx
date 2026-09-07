import Link from "next/link";
import Footer from "@/components/Footer";

const whatWeDo = [
  {
    title: "Sewing & Automation",
    description:
      "High-performance sewing machines and engineered workstations built for speed, precision, and consistency.",
  },
  {
    title: "Cutting & CAD Solutions",
    description:
      "CNC cutting and pattern design systems that improve accuracy, reduce waste, and speed up production.",
  },
  {
    title: "Printing, Finishing & Laser",
    description:
      "Modern printing and laser finishing technologies that deliver premium results with lower water, energy, and labour usage.",
  },
  {
    title: "Laundry & Garment Dyeing",
    description:
      "Efficient and sustainable laundry and dyeing systems that enhance garment quality while reducing resource consumption.",
  },
];

const whyChoose = [
  {
    title: "Global Technology, Local Expertise",
    description:
      "We partner with leading international manufacturers and combine that with on-the-ground industry knowledge.",
  },
  {
    title: "Production-Proven Equipment",
    description:
      "Every machine we supply is selected for reliability, performance, and long-term value.",
  },
  {
    title: "End-to-End Support",
    description:
      "From consultation and installation to training and after-sales service, we support you at every stage.",
  },
  {
    title: "Built for Modern Manufacturing",
    description:
      "Many of our systems are Industry 4.0 ready, enabling smarter production, monitoring, and data-driven decision-making.",
  },
];

const industries = [
  "Apparel & fashion manufacturing",
  "Denim & jeans production",
  "Workwear & uniforms",
  "Sportswear & performance garments",
  "Industrial & technical textiles",
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="bg-black text-white text-center px-6 py-28">
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight max-w-4xl mx-auto">
          Advanced Garment Manufacturing Solutions
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-white/80">
          Precision machinery. Smarter production. Reliable performance.
        </p>
        <Link
          href="/contact"
          className="inline-block mt-8 px-8 py-3 border border-red text-white rounded-full hover:bg-red transition-colors"
        >
          Explore our solutions
        </Link>
      </section>

      {/* Intro blurb */}
      <section className="bg-black text-white text-center px-6 pb-20">
        <p className="max-w-3xl mx-auto text-white/80 text-lg">
          Rightback supplies world-class apparel manufacturing technology to
          factories across Southern Africa. From sewing and automation to
          cutting, finishing, printing, and digital systems, we help
          manufacturers increase efficiency, quality, and output,{" "}
          <span className="font-semibold text-white">without compromise.</span>
        </p>
      </section>

      {/* Proven machinery */}
      <section className="bg-cream text-center px-6 py-20">
        <h2 className="text-3xl font-bold text-black">
          Proven, production-ready machinery
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-black/70">
          For over two decades, Rightback has partnered with leading global
          manufacturers to deliver proven, production-ready machinery to the
          garment, denim, and textile industries. We don&apos;t just sell
          machines, we provide complete production solutions, backed by{" "}
          <span className="font-semibold text-black">
            technical expertise, trusted brands, and long-term support.
          </span>
        </p>
      </section>

      {/* What we do */}
      <section className="bg-black text-white px-6 py-24">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <p className="text-red font-semibold tracking-wide uppercase text-sm mb-2">
            What we do
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Complete Apparel Production Solutions
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-white/70">
            Rightback offers end-to-end equipment for every stage of garment
            manufacturing, helping you streamline operations and stay
            competitive in a fast-moving industry.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whatWeDo.map((item) => (
            <div
              key={item.title}
              className="bg-white/5 rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.description}</p>
              </div>
              <span className="mt-6 inline-block text-red text-sm font-medium cursor-pointer hover:underline">
                Learn more →
              </span>
            </div>
          ))}
        </div>

        <p className="text-center mt-16 text-white/60">
          Each solution is selected for performance, reliability, and
          real-world production demands.
        </p>
      </section>

      {/* Why choose us */}
      <section className="bg-cream px-6 py-24">
        <h2 className="text-3xl font-bold text-black text-center mb-16">
          Why Choose Rightback
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChoose.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl p-6 shadow-sm text-center"
            >
              <h3 className="font-semibold text-black mb-3">{item.title}</h3>
              <p className="text-black/70 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries we serve */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-black mb-6">
              Industries We Serve
            </h2>
            <ul className="space-y-2 text-black/80">
              {industries.map((industry) => (
                <li key={industry} className="flex items-start gap-2">
                  <span className="text-red mt-1">●</span>
                  {industry}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-black/5 rounded-2xl h-64 md:h-80" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white text-center px-6 py-24">
        <h2 className="text-3xl sm:text-4xl font-bold max-w-3xl mx-auto">
          Power Your Production with Smarter Technology
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-white/70">
          Whether you&apos;re expanding capacity, improving efficiency, or
          investing in automation, Rightback has the technology, and the
          expertise, to support your growth.
        </p>
        <Link
          href="/contact"
          className="inline-block mt-8 px-8 py-3 border border-red text-white rounded-full hover:bg-red transition-colors"
        >
          Contact us
        </Link>
      </section>

      <Footer />
    </div>
  );
}