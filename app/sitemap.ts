import type { MetadataRoute } from "next";

const SITE_URL = "https://www.rightback.co.za";

const pages = [
  "",
  "/sewing",
  "/vibemac",
  "/maica",
  "/cutting",
  "/print",
  "/laundry",
  "/cad-pattern-design",
  "/laser-machines",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
