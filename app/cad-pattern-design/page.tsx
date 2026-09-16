import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";
import VisionCutUseCases from "@/components/VisionCutUseCases";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

type DbProduct = {
  id: string;
  brand: string;
  name: string;
  tagline: string | null;
  description: string[];
  more_info: string[];
  groups: { label: string; items: string[] }[];
  specs: { label: string; value: string }[];
  image_url: string | null;
};

export default async function CADPatternDesignPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", "cad-pattern-design")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load CAD Pattern Design products:", error.message);
  }

  const list = (products ?? []) as DbProduct[];

  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Digital Design & Cutting"
        title="CAD Pattern Design"
        ghostWord="GEMINI"
        description="A complete digital suite for pattern making, digitization, marker planning, and precision cutting — from design to production."
        stats={[
          { value: String(list.length), label: "Software Tools" },
          { value: "60%", label: "Faster Development" },
          { value: "30%", label: "Material Savings" },
        ]}
      />

      <section>
        {list.map((product, i) => (
          <ProductCard
            key={product.id}
            index={i + 1}
            brand={product.brand}
            name={product.name}
            tagline={product.tagline ?? ""}
            description={product.description}
            moreInfo={product.more_info}
            groups={product.groups}
            specs={product.specs}
            imageSrc={product.image_url ?? undefined}
          />
        ))}
      </section>

      <VisionCutUseCases />
    </div>
  );
}