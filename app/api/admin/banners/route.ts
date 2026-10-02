import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const now = new Date().toISOString();

  const { data, error } = await supabase
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