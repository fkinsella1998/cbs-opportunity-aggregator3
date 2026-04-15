import { Suspense } from "react";

import FilterBar from "@/components/feed/FilterBar";
import FeedListClient from "@/components/feed/FeedListClient";
import { buildMockOpportunities } from "@/lib/mock-opportunities";
import { supabaseServer } from "@/lib/supabase-server";
import type { OpportunityWithMeta } from "@/types";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const { data: opportunities } = await supabaseServer
    .from("opportunities")
    .select("*")
    .eq("status", "Live")
    .order("went_live_at", { ascending: false })
    .limit(50);

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
        .limit(50);

  const items: OpportunityWithMeta[] = (refreshed || [])
    .filter((opp) => Boolean(opp.id) && opp.id !== "undefined")
    .map((opp) => ({
      ...opp,
      is_bookmarked: false,
      has_applied: false,
    }));

  return (
    <div className="animate-fade-in">
      <FilterBar />
      <Suspense
        fallback={
          <p className="text-text-tertiary text-sm font-mono">
            Loading opportunities...
          </p>
        }
      >
        <FeedListClient items={items} />
      </Suspense>
    </div>
  );
}
