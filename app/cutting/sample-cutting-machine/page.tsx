import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";
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

export default async function SampleCuttingMachinePage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", "cutting/sample-cutting-machine")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load Sample Cutting Machine products:", error.message);
  }

  const list = (products ?? []) as DbProduct[];

  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Cutting"
        title="Sample Cutting Machine"
        ghostWord="SAMPLE"
        description="Precision sample cutting for garments, patterns, and rigid plate materials — one machine, multiple cutting modes."
        stats={[
          { value: String(list.length), label: "System" },
          { value: "3", label: "Cutting Modes" },
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
    </div>
  );
}