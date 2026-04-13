import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const session = await getSession();
  if (!session.student_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseServer
    .from("public.bookmarks")
    .select("opportunity_id, opportunities(*)")
    .eq("student_id", session.student_id)
    .eq("is_active", true);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ bookmarks: data || [] });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.student_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { opportunity_id } = (await req.json()) as { opportunity_id?: string };
  if (!opportunity_id) {
    return NextResponse.json({ error: "opportunity_id required" }, { status: 400 });
  }

  const { data: existing } = await supabaseServer
    .from("public.bookmarks")
    .select("id, is_active")
    .eq("student_id", session.student_id)
    .eq("opportunity_id", opportunity_id)
    .single();

  if (existing?.is_active) {
    await supabaseServer
      .from("public.bookmarks")
      .update({ is_active: false })
      .eq("id", existing.id);
    await supabaseServer.rpc("public.decrement_bookmark_count", {
      opp_id: opportunity_id,
    });
    return NextResponse.json({ is_bookmarked: false });
  }

  if (existing) {
    await supabaseServer
      .from("public.bookmarks")
      .update({ is_active: true })
      .eq("id", existing.id);
  } else {
    await supabaseServer.from("public.bookmarks").insert({
      student_id: session.student_id,
      opportunity_id,
      is_active: true,
    });
  }

  await supabaseServer.rpc("public.increment_bookmark_count", {
    opp_id: opportunity_id,
  });

  return NextResponse.json({ is_bookmarked: true });
}
