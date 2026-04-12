import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session.student_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: opportunity } = await supabaseServer
    .from("opportunities")
    .select("*")
    .eq("id", params.id)
    .eq("status", "Live")
    .single();

  if (!opportunity) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  supabaseServer.rpc("increment_view_count", { opp_id: params.id });

  const { data: alumni } = await supabaseServer
    .from("alumni")
    .select("id, first_name, last_name, title, linkedin_url, graduation_year")
    .ilike("company_name", opportunity.company_name)
    .limit(10);

  const [bmRes, appRes] = await Promise.all([
    supabaseServer
      .from("bookmarks")
      .select("is_active")
      .eq("student_id", session.student_id)
      .eq("opportunity_id", params.id)
      .single(),
    supabaseServer
      .from("applications")
      .select("id")
      .eq("student_id", session.student_id)
      .eq("opportunity_id", params.id)
      .single(),
  ]);

  return NextResponse.json({
    ...opportunity,
    alumni: alumni || [],
    is_bookmarked: bmRes.data?.is_active === true,
    has_applied: !!appRes.data,
  });
}
