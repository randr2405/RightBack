import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/admin/site-settings — there's always exactly one row
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}

// PATCH /api/admin/site-settings — updates the single row by id
export async function PATCH(request: Request) {
  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: "Missing settings id" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .update({
      company_name: body.company_name,
      tagline: body.tagline,
      logo_url: body.logo_url,
      phones: body.phones ?? [],
      emails: body.emails ?? [],
      address: body.address,
      facebook: body.facebook,
      instagram: body.instagram,
      linkedin: body.linkedin,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}