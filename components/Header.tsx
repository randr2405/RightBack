"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Sewing",
    href: "/sewing",
    children: [
      { label: "Lockstitch", href: "/sewing/lockstitch" },
      { label: "Engineered Workstations", href: "/sewing/engineered-workstations" },
    ],
  },
  {
    label: "Vibemac",
    href: "/vibemac",
    children: [{ label: "Jeans Technology", href: "/vibemac/jeans-technology" }],
  },
  {
    label: "Maica",
    href: "/maica",
    children: [{ label: "Shirt Technology", href: "/maica/shirt-technology" }],
  },
  {
    label: "Cutting",
    href: "/cutting",
    children: [
      { label: "CNC Cutting", href: "/cutting/cnc-cutting" },
      { label: "Sample Cutting Machine", href: "/cutting/sample-cutting-machine" },
      { label: "Spreading Machine", href: "/cutting/spreading-machine" },
    ],
  },
  {
    label: "Print",
    href: "/print",
    children: [
      { label: "Pattern Marker Plotters", href: "/print/pattern-marker-plotters" },
      { label: "DTF Printers", href: "/print/dtf-printers" },
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
                  className="flex items-center gap-1 text-sm font-medium text-black hover:text-red transition-colors"
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      openMenu === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-black hover:text-red transition-colors"
                >
                  {item.label}
                </Link>
              )}

              {item.children && openMenu === item.label && (
                <div className="absolute top-full left-0 pt-2 min-w-[220px]">
                  <div className="bg-white shadow-lg rounded-md py-2 border border-black/5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpenMenu(null)}
                        className="block px-4 py-2 text-sm text-black hover:bg-cream hover:text-red transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}