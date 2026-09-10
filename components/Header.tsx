"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Sewing",
    href: "/sewing",
    children: [
      { label: "Lockstitch", href: "/sewing/lockstitch", desc: "High-speed precision stitching" },
      { label: "Engineered Workstations", href: "/sewing/engineered-workstations", desc: "Ergonomic, production-ready setups" },
    ],
  },
  {
    label: "Vibemac",
    href: "/vibemac",
    children: [{ label: "Jeans Technology", href: "/vibemac/jeans-technology", desc: "Specialist denim machinery" }],
  },
  {
    label: "Maica",
    href: "/maica",
    children: [{ label: "Shirt Technology", href: "/maica/shirt-technology", desc: "Precision shirt manufacturing" }],
  },
  {
    label: "Cutting",
    href: "/cutting",
    children: [
      { label: "CNC Cutting", href: "/cutting/cnc-cutting", desc: "Automated precision cutting" },
      { label: "Sample Cutting Machine", href: "/cutting/sample-cutting-machine", desc: "Fast, accurate sampling" },
      { label: "Spreading Machine", href: "/cutting/spreading-machine", desc: "Efficient fabric spreading" },
    ],
  },
  {
    label: "Print",
    href: "/print",
    children: [
      { label: "Pattern Marker Plotters", href: "/print/pattern-marker-plotters", desc: "High-precision plotting" },
      { label: "DTF Printers", href: "/print/dtf-printers", desc: "Direct-to-film & UV DTF" },
    ],
  },
  { label: "Laundry", href: "/laundry" },
  { label: "CAD Pattern Design", href: "/cad-pattern-design" },
  { label: "Laser Machines", href: "/laser-machines" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-cream border-b border-black/10 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-black">
          RightBack <span className="text-red">Technology</span>
        </Link>

        <nav ref={navRef} className="flex items-center gap-6">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.children ? (
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu(openMenu === item.label ? null : item.label)
                  }
                  className="flex items-center gap-1 text-sm font-medium text-black hover:text-red transition-colors py-2"
                >
                  {item.label}
                  <motion.span
                    animate={{ rotate: openMenu === item.label ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown size={14} />
                  </motion.span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-black hover:text-red transition-colors py-2 inline-block"
                >
                  {item.label}
                </Link>
              )}

              <AnimatePresence>
                {item.children && openMenu === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3 min-w-[280px] z-50"
                  >
                    <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-black/5 p-2 overflow-hidden">
                      <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: {},
                          show: { transition: { staggerChildren: 0.05 } },
                        }}
                      >
                        {item.children.map((child) => (
                          <motion.div
                            key={child.href}
                            variants={{
                              hidden: { opacity: 0, x: -8 },
                              show: { opacity: 1, x: 0 },
                            }}
                          >
                            <Link
                              href={child.href}
                              onClick={() => setOpenMenu(null)}
                              className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-50 transition-colors relative"
                            >
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-red rounded-full transition-all duration-200 group-hover:h-8" />
                              <div className="flex-1 min-w-0 pl-2">
                                <div className="text-sm font-semibold text-black">
                                  {child.label}
                                </div>
                                <div className="text-xs text-black/45 mt-0.5">
                                  {child.desc}
                                </div>
                              </div>
                              <ArrowRight
                                size={14}
                                className="text-black/20 group-hover:text-red group-hover:translate-x-0.5 transition-all shrink-0"
                              />
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}