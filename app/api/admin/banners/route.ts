import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const editable = [
  "title",
  "description",
  "image_url",
  "link_url",
  "cta_label",
  "is_active",
  "starts_at",
  "ends_at",
] as const;

function pick(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const key of editable) {
    if (key in body) out[key] = body[key];
  }
  return out;
}

function invalidSchedule(fields: Record<string, unknown>) {
  const start = fields.starts_at as string | null | undefined;
  const end = fields.ends_at as string | null | undefined;
  if (start && end && new Date(end).getTime() <= new Date(start).getTime()) {
    return true;
  }
  return false;
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ banners: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const fields = pick(body);

  if (typeof fields.title !== "string" || !fields.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (invalidSchedule(fields)) {
    return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
  }

  const client = supabaseAdmin;
  const { data: last } = await client
    .from("banners")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = (last?.[0]?.sort_order ?? -1) + 1;

  const { data, error } = await client
    .from("banners")
    .insert({ ...fields, title: (fields.title as string).trim(), sort_order: nextOrder })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ banner: data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const client = supabaseAdmin;

  if (Array.isArray(body.order)) {
    const results = await Promise.all(
      (body.order as string[]).map((id, index) =>
        client.from("banners").update({ sort_order: index }).eq("id", id)
      )
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      return NextResponse.json({ error: failed.error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const fields = pick(body);

  if ("title" in fields && (typeof fields.title !== "string" || !fields.title.trim())) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (invalidSchedule(fields)) {
    return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
  }

  const { data, error } = await client
    .from("banners")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ banner: data });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabaseAdmin.from("banners").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}