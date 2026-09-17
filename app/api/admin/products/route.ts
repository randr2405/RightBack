import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/admin/products — list every product, across all categories
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}

// POST /api/admin/products — create a new product
export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      category: body.category,
      sort_order: body.sort_order ?? 0,
      brand: body.brand ?? "",
      name: body.name ?? "Untitled Product",
      tagline: body.tagline ?? null,
      description: body.description ?? [],
      more_info: body.more_info ?? [],
      groups: body.groups ?? [],
      specs: body.specs ?? [],
      image_url: body.image_url ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}