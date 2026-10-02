import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("banners")
    .select("id, title, description, image_url, link_url, cta_label")
    .eq("is_active", true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gt.${now}`)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ banners: [] }, { status: 200 });
  }

  return NextResponse.json(
    { banners: data ?? [] },
    { headers: { "Cache-Control": "no-store" } }
  );
}