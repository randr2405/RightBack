"use client";

import { useState } from "react";
import Link from "next/link";

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

  return (
    <header className="bg-cream border-b border-black/10 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-black">
          RightBack <span className="text-red">Technology</span>
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setOpenMenu(item.label)}
              onMouseLeave={() => item.children && setOpenMenu(null)}
            >
              <Link
                href={item.href}
                className="text-sm font-medium text-black hover:text-red transition-colors"
              >
                {item.label}
              </Link>

              {item.children && openMenu === item.label && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md py-2 min-w-[200px]">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-black hover:bg-cream hover:text-red"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}