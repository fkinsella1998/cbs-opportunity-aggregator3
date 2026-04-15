import EmptyFeed from "@/components/feed/EmptyFeed";
import FilterBar from "@/components/feed/FilterBar";
import OpportunityCard from "@/components/feed/OpportunityCard";
import { buildMockOpportunities } from "@/lib/mock-opportunities";
import { supabaseServer } from "@/lib/supabase-server";
import type { OpportunityWithMeta } from "@/types";

export const dynamic = "force-dynamic";

export default async function FeedPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const param = (key: string) => {
    const value = searchParams?.[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const alumniOnly = param("alumni") === "true";
  const newThisWeek = param("new") === "true";
  const industry = param("industry");
  const func = param("function");
  const stage = param("stage");
  const type = param("type");

  const query = supabaseServer
    .from("opportunities")
    .select("*")
    .eq("status", "Live")
    .order("went_live_at", { ascending: false })
    .limit(25);

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

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const items: OpportunityWithMeta[] = (refreshed || [])
    .filter((opp) => Boolean(opp.id) && opp.id !== "undefined")
    .filter((opp) => {
      if (alumniOnly && opp.has_cbs_alumni !== "Yes") return false;
      if (newThisWeek && new Date(opp.went_live_at) < weekAgo) return false;
      if (industry) {
        const industryValue = (opp as { industry?: string }).industry ?? opp.function;
        if (!industryValue || industryValue !== industry) return false;
      }
      if (func && opp.function !== func) return false;
      if (stage && opp.company_stage !== stage) return false;
      if (type && opp.employment_type !== type) return false;
      return true;
    })
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
