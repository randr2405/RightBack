import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// PATCH /api/admin/products/[id] — update an existing product
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from("products")
    .update({
      category: body.category,
      sort_order: body.sort_order,
      brand: body.brand,
      name: body.name,
      tagline: body.tagline,
      description: body.description,
      more_info: body.more_info,
      groups: body.groups,
      specs: body.specs,
      image_url: body.image_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

// DELETE /api/admin/products/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}