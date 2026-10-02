"use client";

import { useEffect, useState } from "react";
import BannerCarousel, { PublicBanner } from "@/components/BannerCarousel";

export default function HomeBanners() {
  const [banners, setBanners] = useState<PublicBanner[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/banners", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.banners) setBanners(data.banners);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (banners.length === 0) return null;

  return <BannerCarousel banners={banners} />;
}