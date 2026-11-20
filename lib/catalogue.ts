export type NavChild = {
  label: string;
  href: string;
  desc: string;
};

export type NavItem = {
  label: string;
  href: string;
  desc?: string;
  children?: NavChild[];
  external?: boolean;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/solutions" },
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
  { label: "Laundry", href: "/laundry", desc: "Garment washing, dyeing and drying systems" },
  { label: "CAD Pattern Design", href: "/cad-pattern-design", desc: "Pattern, marker and cut-planning software" },
  { label: "Laser Machines", href: "/laser-machines", desc: "Laser finishing and cutting systems" },
  {
    label: "Online Parts Store",
    href: "https://acc.rightback.co.za:8443/ords/r/rbserp/streamline-retail-catalogue/rightback-catalogue-items",
    external: true,
  },
  { label: "Contact", href: "/contact" },
];

export type SectionLink = {
  label: string;
  href: string;
  desc: string;
};

export type Section = {
  label: string;
  href: string;
  links: SectionLink[];
};

const EXCLUDED_HREFS = new Set(["/", "/solutions", "/contact"]);

export const sections: Section[] = navItems
  .filter((item) => !item.external && !EXCLUDED_HREFS.has(item.href))
  .map((item) => ({
    label: item.label,
    href: item.href,
    links:
      item.children && item.children.length > 0
        ? item.children
        : [{ label: `View ${item.label}`, href: item.href, desc: item.desc ?? "" }],
  }));

export function categoryPath(href: string) {
  return href.replace(/^\//, "");
}

export function sectionForCategory(category: string): Section | undefined {
  return sections.find((s) => {
    const base = categoryPath(s.href);
    return category === base || category.startsWith(`${base}/`);
  });
}

export function categoryInfo(category: string): { section: string; label: string } {
  for (const s of sections) {
    for (const link of s.links) {
      if (link.href === `/${category}`) {
        const label = s.links.length === 1 && link.href === s.href ? s.label : link.label;
        return { section: s.label, label };
      }
    }
  }
  const section = sectionForCategory(category);
  const last = category.split("/").pop() ?? category;
  return {
    section: section?.label ?? "",
    label: last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}