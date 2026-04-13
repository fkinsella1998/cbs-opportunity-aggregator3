import EmptyFeed from "@/components/feed/EmptyFeed";
import OpportunityCard from "@/components/feed/OpportunityCard";
import { supabaseServer } from "@/lib/supabase-server";
import type { OpportunityWithMeta } from "@/types";

export default async function SavedPage() {
  const { data: bookmarks } = await supabaseServer
    .from("bookmarks")
    .select("opportunities(*)")
    .eq("is_active", true);

  const items: OpportunityWithMeta[] = (bookmarks || [])
    .map((row) => row.opportunities as OpportunityWithMeta | null)
    .filter((opp): opp is OpportunityWithMeta => Boolean(opp))
    .map((opp) => ({
      ...opp,
      is_bookmarked: true,
      has_applied: false,
    }));

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-text text-lg font-medium">Saved</h1>
        <p className="text-text-tertiary text-sm font-mono mt-0.5">
          ({items.length})
        </p>
      </div>
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
