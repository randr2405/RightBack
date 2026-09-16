import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // re-fetch from Supabase at most once a minute

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

export default async function JeansTechnologyPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", "vibemac/jeans-technology")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load Jeans Technology products:", error.message);
  }

  const list = (products ?? []) as DbProduct[];

  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Vibemac"
        title="Jeans Technology"
        ghostWord="VIBEMAC"
        description="Precision automation for denim production — from pocket setting and hemming to waistbands and specialty stitching."
        stats={[
          { value: String(list.length), label: "Machines" },
          { value: "IT", label: "Made in Italy" },
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