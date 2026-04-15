import EmptyFeed from "@/components/feed/EmptyFeed";
import FilterBar from "@/components/feed/FilterBar";
import OpportunityCard from "@/components/feed/OpportunityCard";
import { buildMockOpportunities } from "@/lib/mock-opportunities";
import { supabaseServer } from "@/lib/supabase-server";
import type { OpportunityWithMeta } from "@/types";

export default async function FeedPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const alumniOnly = searchParams?.alumni === "true";
  const newThisWeek = searchParams?.new === "true";
  const industry = typeof searchParams?.industry === "string" ? searchParams.industry : null;
  const func = typeof searchParams?.function === "string" ? searchParams.function : null;
  const stage = typeof searchParams?.stage === "string" ? searchParams.stage : null;
  const type = typeof searchParams?.type === "string" ? searchParams.type : null;

  let query = supabaseServer
    .from("opportunities")
    .select("*")
    .eq("status", "Live")
    .order("went_live_at", { ascending: false })
    .limit(25);
  if (alumniOnly) {
    query = query.eq("has_cbs_alumni", "Yes");
  }
  if (newThisWeek) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    query = query.gte("went_live_at", weekAgo);
  }
  if (industry) {
    query = query.eq("function", industry);
  }
  if (func) {
    query = query.eq("function", func);
  }
  if (stage) {
    query = query.eq("company_stage", stage);
  }
  if (type) {
    query = query.eq("employment_type", type);
  }

  const { data: opportunities } = await query;

  const hasMissingId = (opportunities || []).some(
    (opp) => !opp.id || opp.id === "undefined",
  );
  if (hasMissingId) {
    await supabaseServer.from("opportunities").delete().is("id", null);
    await supabaseServer.from("opportunities").delete().eq("id", "undefined");
    await supabaseServer.from("opportunities").delete().eq("id", "");
  }

  if (!opportunities || opportunities.length === 0 || hasMissingId) {
    const seed = buildMockOpportunities().map((opportunity) => ({
      ...opportunity,
      view_count: 0,
      click_count: 0,
      bookmark_count: 0,
      application_count: 0,
    }));
    await supabaseServer.from("opportunities").insert(seed);
  }

  const { data: refreshed } = opportunities?.length
    ? { data: opportunities }
    : await supabaseServer
        .from("opportunities")
        .select("*")
        .eq("status", "Live")
        .order("went_live_at", { ascending: false })
        .limit(25);

  const items: OpportunityWithMeta[] = (refreshed || [])
    .filter((opp) => Boolean(opp.id) && opp.id !== "undefined")
    .map((opp) => ({
      ...opp,
      is_bookmarked: false,
      has_applied: false,
    }));

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-text text-lg font-medium">Non-OCR Opportunities</h1>
        <p className="text-text-tertiary text-sm font-mono mt-0.5">
          {items.length} opportunities
        </p>
      </div>
      <FilterBar />
      {items.length === 0 ? (
        <EmptyFeed />
      ) : (
        <div>
          {items.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      )}
    </div>
  );
}
