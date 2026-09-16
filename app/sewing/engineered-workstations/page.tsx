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

export default async function EngineeredWorkstationsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", "sewing/engineered-workstations")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load Engineered Workstations products:", error.message);
  }

  const list = (products ?? []) as DbProduct[];

  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Sewing"
        title="Engineered Workstations"
        ghostWord="BRUCE"
        description="Buttonhole and Buttonsew Machines"
        stats={[
          { value: String(list.length), label: "Machines" },
          { value: "CN", label: "Manufactured" },
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