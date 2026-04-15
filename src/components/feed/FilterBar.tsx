"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const industryOptions = [
  "All industries",
  "Technology",
  "Finance & FinTech",
  "Media & Entertainment",
  "Consumer & Retail",
  "Healthcare & Biotech",
  "Climate & Energy",
  "Real Estate & PropTech",
  "Education",
  "Government & Nonprofit",
  "Other",
];
const functionOptions = [
  "All functions",
  "Strategy",
  "Operations",
  "Finance",
  "Marketing",
  "Product",
  "Business Development",
  "General Management",
  "Other",
];
const stageOptions = [
  "All stages",
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Growth",
  "Other",
];
const typeOptions = ["All types", "Full-time", "Internship", "Part-time", "Project"];

export default function FilterBar() {
  const router = useRouter();
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const alumniOnly = params.get("alumni") === "true";
  const newThisWeek = params.get("new") === "true";
  const selectedIndustry = params.get("industry") ?? "All industries";
  const selectedFunction = params.get("function") ?? "All functions";
  const selectedStage = params.get("stage") ?? "All stages";
  const selectedType = params.get("type") ?? "All types";

  const toggleParam = (key: "alumni" | "new") => {
    const next = new URLSearchParams(params.toString());
    const current = next.get(key) === "true";
    if (current) {
      next.delete(key);
    } else {
      next.set(key, "true");
    }
    router.replace(`/feed?${next.toString()}`);
  };

  const updateSelect = (key: "industry" | "function" | "stage" | "type") =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const next = new URLSearchParams(params.toString());
      const value = event.target.value;
      if (value.startsWith("All ")) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      router.replace(`/feed?${next.toString()}`);
    };

  return (
    <div className="sticky top-0 bg-background border-b border-border-subtle py-4 mb-6">
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-[0.08em] text-text-secondary">
        <select
          value={selectedIndustry}
          onChange={updateSelect("industry")}
          className="border border-border bg-transparent px-3 py-2 rounded text-text-secondary"
        >
          {industryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={selectedFunction}
          onChange={updateSelect("function")}
          className="border border-border bg-transparent px-3 py-2 rounded text-text-secondary"
        >
          {functionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={selectedStage}
          onChange={updateSelect("stage")}
          className="border border-border bg-transparent px-3 py-2 rounded text-text-secondary"
        >
          {stageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={updateSelect("type")}
          className="border border-border bg-transparent px-3 py-2 rounded text-text-secondary"
        >
          {typeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
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
