import EmptyFeed from "@/components/feed/EmptyFeed";
import FilterBar from "@/components/feed/FilterBar";
import OpportunityCard from "@/components/feed/OpportunityCard";
import { supabaseServer } from "@/lib/supabase-server";
import type { OpportunityWithMeta } from "@/types";

export default async function FeedPage() {
  const { data: opportunities } = await supabaseServer
    .from("public.opportunities")
    .select("*")
    .eq("status", "Live")
    .order("went_live_at", { ascending: false })
    .limit(25);

  const items: OpportunityWithMeta[] = (opportunities || []).map((opp) => ({
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
