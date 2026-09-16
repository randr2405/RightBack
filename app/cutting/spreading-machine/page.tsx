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

export default async function SpreadingMachinePage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", "cutting/spreading-machine")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load Spreading Machine products:", error.message);
  }

  const list = (products ?? []) as DbProduct[];

  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Cutting"
        title="Spreading Machine"
        ghostWord="SPREAD"
        description="High-stability automatic fabric spreading with intelligent tension control, built for consistent quality at speed."
        stats={[
          { value: String(list.length), label: "System" },
          { value: "11", label: "Optional Modules" },
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