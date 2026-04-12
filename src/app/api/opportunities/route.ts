import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase-server";

const PAGE_SIZE = 25;

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session.student_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const industry = searchParams.getAll("industry");
  const func = searchParams.getAll("function");
  const stage = searchParams.getAll("stage");
  const type = searchParams.getAll("type");
  const alumniOnly = searchParams.get("alumni") === "true";
  const newThisWeek = searchParams.get("new") === "true";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const offset = (page - 1) * PAGE_SIZE;

  let query = supabaseServer
    .from("opportunities")
    .select("*", { count: "exact" })
    .eq("status", "Live")
    .order("went_live_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (alumniOnly) query = query.eq("has_cbs_alumni", "Yes");
  if (newThisWeek) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    query = query.gte("went_live_at", weekAgo);
  }
  if (industry.length > 0) query = query.in("function", industry);
  if (func.length > 0) query = query.in("function", func);
  if (stage.length > 0) query = query.in("company_stage", stage);
  if (type.length > 0) query = query.in("employment_type", type);

  const { data: opportunities, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const [bookmarksRes, applicationsRes] = await Promise.all([
    supabaseServer
      .from("bookmarks")
      .select("opportunity_id")
      .eq("student_id", session.student_id)
      .eq("is_active", true),
    supabaseServer
      .from("applications")
      .select("opportunity_id")
      .eq("student_id", session.student_id),
  ]);

  const bookmarkedIds = new Set(
    (bookmarksRes.data || []).map((bookmark) => bookmark.opportunity_id),
  );
  const appliedIds = new Set(
    (applicationsRes.data || []).map((app) => app.opportunity_id),
  );

  const enriched = (opportunities || []).map((opp) => ({
    ...opp,
    is_bookmarked: bookmarkedIds.has(opp.id),
    has_applied: appliedIds.has(opp.id),
  }));

  return NextResponse.json({
    opportunities: enriched,
    total: count || 0,
    page,
    has_more: offset + PAGE_SIZE < (count || 0),
  });
}
