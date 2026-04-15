"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const staticFilters = ["Industry", "Function", "Stage", "Type"];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alumniOnly = searchParams.get("alumni") === "true";
  const newThisWeek = searchParams.get("new") === "true";

  const toggleParam = (key: "alumni" | "new") => {
    const next = new URLSearchParams(searchParams.toString());
    const current = next.get(key) === "true";
    if (current) {
      next.delete(key);
    } else {
      next.set(key, "true");
    }
    router.replace(`/feed?${next.toString()}`);
  };

  return (
    <div className="sticky top-0 bg-background border-b border-border-subtle py-4 mb-6">
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-[0.08em] text-text-secondary">
        {staticFilters.map((label) => (
          <span key={label} className="border border-border px-3 py-2 rounded">
            {label}
          </span>
        ))}
        <button
          type="button"
          onClick={() => toggleParam("alumni")}
          className={`border px-3 py-2 rounded ${
            alumniOnly ? "border-text text-text" : "border-border"
          }`}
        >
          CBS Alumni
        </button>
        <button
          type="button"
          onClick={() => toggleParam("new")}
          className={`border px-3 py-2 rounded ${
            newThisWeek ? "border-text text-text" : "border-border"
          }`}
        >
          New this week
        </button>
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
