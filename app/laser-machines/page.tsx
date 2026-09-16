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

export default async function LaserMachinesPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", "laser-machines")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load Laser Machines products:", error.message);
  }

  const list = (products ?? []) as DbProduct[];

  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Precision Finishing"
        title="Laser Machines"
        ghostWord="LASER"
        description="Modern laser marking, finishing, and cutting technology for denim, garments, and sublimation fabrics."
        stats={[
          { value: String(list.length), label: "Systems" },
          { value: "2", label: "Global Brands" },
          { value: "4x", label: "Productivity Gain" },
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