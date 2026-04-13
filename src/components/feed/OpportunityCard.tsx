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
  const query: Record<string, string> = {};
  if (opportunity.role_title) query.role_title = opportunity.role_title;
  if (opportunity.company_name) query.company_name = opportunity.company_name;
  if (opportunity.description) query.description = opportunity.description;
  if (opportunity.location) query.location = opportunity.location;
  if (opportunity.function) query.function = opportunity.function;
  if (opportunity.company_stage) query.company_stage = opportunity.company_stage;
  if (opportunity.employment_type) query.employment_type = opportunity.employment_type;
  if (opportunity.application_link)
    query.application_link = opportunity.application_link;
  if (opportunity.application_deadline)
    query.application_deadline = opportunity.application_deadline;
  if (opportunity.has_cbs_alumni) query.has_cbs_alumni = opportunity.has_cbs_alumni;
  if (opportunity.source) query.source = opportunity.source;
  if (opportunity.went_live_at) query.went_live_at = opportunity.went_live_at;

  return (
    <Link
      href={{ pathname: `/feed/${safeId}`, query }}
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
