"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [selectedIndustry, setSelectedIndustry] = useState("All industries");
  const [selectedFunction, setSelectedFunction] = useState("All functions");
  const [selectedStage, setSelectedStage] = useState("All stages");
  const [selectedType, setSelectedType] = useState("All types");
  const [alumniOnly, setAlumniOnly] = useState(false);
  const [newThisWeek, setNewThisWeek] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setSelectedIndustry(params.get("industry") ?? "All industries");
    setSelectedFunction(params.get("function") ?? "All functions");
    setSelectedStage(params.get("stage") ?? "All stages");
    setSelectedType(params.get("type") ?? "All types");
    setAlumniOnly(params.get("alumni") === "true");
    setNewThisWeek(params.get("new") === "true");
  }, []);

  useEffect(() => {
    async function loadProfileDefaults() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) return;
        const data = await res.json();
        const profile = data.profile;
        if (!profile) return;
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        let changed = false;

        if (!params.get("industry") && profile.industry_interests?.length) {
          params.set("industry", profile.industry_interests[0]);
          setSelectedIndustry(profile.industry_interests[0]);
          changed = true;
        }
        if (!params.get("function") && profile.function_interests?.length) {
          params.set("function", profile.function_interests[0]);
          setSelectedFunction(profile.function_interests[0]);
          changed = true;
        }
        if (!params.get("type") && profile.employment_type_pref) {
          const mapping: Record<string, string> = {
            full_time: "Full-time",
            internship: "Internship",
            both: "All types",
          };
          const nextType = mapping[profile.employment_type_pref] ?? "All types";
          if (nextType !== "All types") {
            params.set("type", nextType);
          }
          setSelectedType(nextType);
          changed = true;
        }

        if (changed) {
          router.replace(`/feed?${params.toString()}`);
        }
      } catch (error) {
        // Ignore profile load errors for MVP filter defaults.
      }
    }

    loadProfileDefaults();
  }, [router]);

  const updateUrl = (next: URLSearchParams) => {
    router.replace(`/feed?${next.toString()}`);
  };

  const toggleParam = (key: "alumni" | "new") => {
    if (typeof window === "undefined") return;
    const next = new URLSearchParams(window.location.search);
    const current = next.get(key) === "true";
    if (current) {
      next.delete(key);
    } else {
      next.set(key, "true");
    }
    if (key === "alumni") setAlumniOnly(!current);
    if (key === "new") setNewThisWeek(!current);
    updateUrl(next);
  };

  const updateSelect = (key: "industry" | "function" | "stage" | "type") =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (typeof window === "undefined") return;
      const next = new URLSearchParams(window.location.search);
      const value = event.target.value;
      if (value.startsWith("All ")) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      if (key === "industry") setSelectedIndustry(value);
      if (key === "function") setSelectedFunction(value);
      if (key === "stage") setSelectedStage(value);
      if (key === "type") setSelectedType(value);
      updateUrl(next);
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
