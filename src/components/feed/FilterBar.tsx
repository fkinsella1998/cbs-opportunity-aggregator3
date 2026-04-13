"use client";

import Link from "next/link";

export default function FilterBar() {
  return (
    <div className="sticky top-0 bg-background border-b border-border-subtle py-4 mb-6">
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-[0.08em] text-text-secondary">
        {["Industry", "Function", "Stage", "Type", "CBS Alumni ●", "New this week ●"].map(
          (label) => (
            <span
              key={label}
              className="border border-border px-3 py-2 rounded"
            >
              {label}
            </span>
          ),
        )}
        <Link
          href="/onboarding"
          className="border border-border px-3 py-2 rounded text-text hover:text-white transition"
        >
          Reset filters
        </Link>
      </div>
    </div>
  );
}
