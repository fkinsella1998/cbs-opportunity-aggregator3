import EmptyFeed from "@/components/feed/EmptyFeed";
import OpportunityCard from "@/components/feed/OpportunityCard";
import { getSession } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase-server";
import type { OpportunityWithMeta } from "@/types";

export default async function SavedPage() {
  const session = await getSession();
  if (!session.student_id) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-text text-lg font-medium">Saved</h1>
          <p className="text-text-tertiary text-sm font-mono mt-0.5">(0)</p>
        </div>
        <EmptyFeed />
      </div>
    );
  }
  const { data: bookmarks } = await supabaseServer
    .from("bookmarks")
    .select("opportunities(*)")
    .eq("student_id", session.student_id)
    .eq("is_active", true);

  const items: OpportunityWithMeta[] = (bookmarks || [])
    .map((row) => row.opportunities as unknown as OpportunityWithMeta | null)
    .filter(
      (opp): opp is OpportunityWithMeta =>
        Boolean(opp?.id) && opp?.id !== "undefined",
    )
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
