"use client";

import Link from "next/link";
import { useState } from "react";

import type { OpportunityWithMeta } from "@/types";
import { cardPostedLabel } from "@/lib/dates";

export default function OpportunityCard({
  opportunity,
}: {
  opportunity: OpportunityWithMeta;
}) {
  const [isBookmarked, setIsBookmarked] = useState(
    Boolean(opportunity.is_bookmarked),
  );
  const [isSaving, setIsSaving] = useState(false);
  const isNew =
    opportunity.went_live_at &&
    new Date(opportunity.went_live_at) >
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const hasValidId = Boolean(opportunity.id) && opportunity.id !== "undefined";
  const safeId = hasValidId ? opportunity.id : "preview";
  const query = new URLSearchParams();
  if (opportunity.role_title) query.set("role_title", opportunity.role_title);
  if (opportunity.company_name) query.set("company_name", opportunity.company_name);
  if (opportunity.description) query.set("description", opportunity.description);
  if (opportunity.location) query.set("location", opportunity.location);
  if (opportunity.function) query.set("function", opportunity.function);
  if (opportunity.company_stage)
    query.set("company_stage", opportunity.company_stage);
  if (opportunity.employment_type)
    query.set("employment_type", opportunity.employment_type);
  if (opportunity.application_link)
    query.set("application_link", opportunity.application_link);
  if (opportunity.application_deadline)
    query.set("application_deadline", opportunity.application_deadline);
  if (opportunity.has_cbs_alumni)
    query.set("has_cbs_alumni", opportunity.has_cbs_alumni);
  if (opportunity.source) query.set("source", opportunity.source);
  if (opportunity.went_live_at) query.set("went_live_at", opportunity.went_live_at);

  const toggleBookmark = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!opportunity.id || opportunity.id === "preview") return;
    setIsSaving(true);
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunity_id: opportunity.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setIsBookmarked(Boolean(data?.is_bookmarked));
    }
    setIsSaving(false);
  };

  return (
    <Link
      href={`/feed/${safeId}?${query.toString()}`}
      className="block border-b border-border-subtle py-4 transition-colors hover:bg-surface-raised"
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
        <button
          type="button"
          onClick={toggleBookmark}
          disabled={isSaving || !opportunity.id || opportunity.id === "preview"}
          className={`text-xs font-mono uppercase tracking-[0.08em] border px-2 py-1 ${
            isBookmarked ? "border-text text-text" : "border-border"
          }`}
          aria-label="Bookmark"
        >
          {isBookmarked ? "✓ Saved" : "Save"}
        </button>
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
        {isNew ? (
          <span className="bg-accent text-white px-2 py-1 rounded">New</span>
        ) : null}
        {opportunity.has_cbs_alumni === "Yes" ? (
          <span className="border border-text text-text px-2 py-1">CBS Alumni</span>
        ) : null}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs font-mono text-text-tertiary">
        <span>{cardPostedLabel(opportunity.went_live_at)}</span>
        <span>{opportunity.source}</span>
      </div>
    </Link>
  );
}
