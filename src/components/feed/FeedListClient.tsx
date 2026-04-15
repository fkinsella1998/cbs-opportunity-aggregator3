"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import EmptyFeed from "@/components/feed/EmptyFeed";
import OpportunityCard from "@/components/feed/OpportunityCard";
import type { OpportunityWithMeta } from "@/types";

const normalize = (value: string) => value.trim().toLowerCase();

const industryMapping: Record<string, string> = {
  finance: "Finance & FinTech",
  strategy: "Technology",
  operations: "Consumer & Retail",
  marketing: "Media & Entertainment",
  product: "Technology",
  analytics: "Technology",
  sustainability: "Climate & Energy",
  "business development": "Technology",
};

export default function FeedListClient({
  items,
}: {
  items: OpportunityWithMeta[];
}) {
  const searchParams = useSearchParams();
  const alumniOnly = searchParams.get("alumni") === "true";
  const newThisWeek = searchParams.get("new") === "true";
  const industry = searchParams.get("industry");
  const func = searchParams.get("function");
  const stage = searchParams.get("stage");
  const type = searchParams.get("type");

  const filtered = useMemo(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const industryFilter = industry ? normalize(industry) : null;
    const functionFilter = func ? normalize(func) : null;
    const stageFilter = stage ? normalize(stage) : null;
    const typeFilter = type ? normalize(type) : null;

    return items.filter((opp) => {
      if (alumniOnly && opp.has_cbs_alumni !== "Yes") return false;
      if (newThisWeek && new Date(opp.went_live_at) < weekAgo) return false;
      if (industryFilter) {
        const rawIndustry = (opp as { industry?: string }).industry ?? opp.function ?? "";
        const derived =
          (opp as { industry?: string }).industry ??
          industryMapping[normalize(rawIndustry)] ??
          rawIndustry;
        if (!derived || normalize(derived) !== industryFilter) return false;
      }
      if (functionFilter && normalize(opp.function ?? "") !== functionFilter) {
        return false;
      }
      if (stageFilter && normalize(opp.company_stage ?? "") !== stageFilter) {
        return false;
      }
      if (typeFilter && normalize(opp.employment_type ?? "") !== typeFilter) {
        return false;
      }
      return true;
    });
  }, [items, alumniOnly, newThisWeek, industry, func, stage, type]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-text text-lg font-medium">Non-OCR Opportunities</h1>
        <p className="text-text-tertiary text-sm font-mono mt-0.5">
          {filtered.length} opportunities
        </p>
      </div>
      {filtered.length === 0 ? (
        <EmptyFeed />
      ) : (
        <div>
          {filtered.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      )}
    </>
  );
}
