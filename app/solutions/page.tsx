import type { Metadata } from "next";
import { Suspense } from "react";
import SolutionsExplorer from "@/components/SolutionsExplorer";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Browse or search RightBack's full range of garment manufacturing machinery: sewing, cutting, printing, laundry, laser, CAD, denim and shirt technology.",
  alternates: {
    canonical: "/solutions",
  },
};

export default function SolutionsPage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-neutral-100" />}>
      <SolutionsExplorer />
    </Suspense>
  );
}