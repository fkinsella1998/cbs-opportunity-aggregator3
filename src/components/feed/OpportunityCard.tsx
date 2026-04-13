import Link from "next/link";

import type { OpportunityWithMeta } from "@/types";
import { timeAgo } from "@/lib/dates";

export default function OpportunityCard({
  opportunity,
}: {
  opportunity: OpportunityWithMeta;
}) {
  const safeId =
    opportunity.id && opportunity.id !== "undefined" ? opportunity.id : "preview";
  const searchParams = new URLSearchParams();
  if (opportunity.role_title) searchParams.set("role_title", opportunity.role_title);
  if (opportunity.company_name)
    searchParams.set("company_name", opportunity.company_name);
  if (opportunity.description)
    searchParams.set("description", opportunity.description);
  if (opportunity.location) searchParams.set("location", opportunity.location);
  if (opportunity.function) searchParams.set("function", opportunity.function);
  if (opportunity.company_stage)
    searchParams.set("company_stage", opportunity.company_stage);
  if (opportunity.employment_type)
    searchParams.set("employment_type", opportunity.employment_type);
  if (opportunity.application_link)
    searchParams.set("application_link", opportunity.application_link);
  if (opportunity.application_deadline)
    searchParams.set("application_deadline", opportunity.application_deadline);
  if (opportunity.has_cbs_alumni)
    searchParams.set("has_cbs_alumni", opportunity.has_cbs_alumni);
  if (opportunity.source) searchParams.set("source", opportunity.source);
  if (opportunity.went_live_at)
    searchParams.set("went_live_at", opportunity.went_live_at);

  return (
    <Link
      href={`/feed/${safeId}?${searchParams.toString()}`}
      className="block border-b border-border-subtle py-4 transition-colors hover:bg-[#0f0f0f]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-text text-sm font-medium">
            {opportunity.role_title}
          </h3>
          <p className="text-text-secondary text-sm">
            {opportunity.company_name} ·{" "}
            <span className="text-text-tertiary">{opportunity.location}</span>
          </p>
        </div>
        <span
          className={`text-xs font-mono uppercase tracking-[0.08em] border px-2 py-1 ${
            opportunity.is_bookmarked ? "border-text text-text" : "border-border"
          }`}
          aria-label="Bookmark"
        >
          {opportunity.is_bookmarked ? "Saved" : "Save"}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-[0.08em] text-text-secondary">
        {opportunity.function ? (
          <span className="border border-border px-2 py-1">{opportunity.function}</span>
        ) : null}
        {opportunity.company_stage ? (
          <span className="border border-border px-2 py-1">
            {opportunity.company_stage}
          </span>
        ) : null}
        {opportunity.has_cbs_alumni === "Yes" ? (
          <span className="border border-text text-text px-2 py-1">CBS Alumni</span>
        ) : null}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs font-mono text-text-tertiary">
        <span>{timeAgo(opportunity.went_live_at)}</span>
        <span>{opportunity.source}</span>
      </div>
    </Link>
  );
}
