"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChipSelect from "@/components/onboarding/ChipSelect";

const industries = [
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

const functions = [
  "Strategy",
  "Operations",
  "Finance",
  "Marketing",
  "Product",
  "Business Development",
  "General Management",
  "Other",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [studentName, setStudentName] = useState("");
  const [graduationYear, setGraduationYear] = useState<2026 | 2027 | null>(null);
  const [employmentType, setEmploymentType] = useState<
    "full_time" | "internship" | "both"
  >("full_time");
  const [sponsorshipPref, setSponsorshipPref] = useState<
    "required" | "not_required" | "open"
  >("open");
  const [industryInterests, setIndustryInterests] = useState<string[]>([]);
  const [functionInterests, setFunctionInterests] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setStudentName(data.student?.first_name ?? "");
      }
    }
    loadProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file || !graduationYear) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const parseRes = await fetch("/api/resume/parse", {
      method: "POST",
      body: formData,
    });

    if (!parseRes.ok) {
      setError("Resume parsing failed. Try again.");
      setLoading(false);
      return;
    }

    const profileRes = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        graduation_year: graduationYear,
        employment_type_pref: employmentType,
        sponsorship_pref: sponsorshipPref,
        industry_interests: industryInterests,
        function_interests: functionInterests,
      }),
    });

    if (!profileRes.ok) {
      setError("Profile save failed. Try again.");
      setLoading(false);
      return;
    }

    router.push("/feed");
  }

  return (
    <main className="min-h-screen bg-background text-text px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-[520px] space-y-10 animate-fade-in"
      >
        <div>
          <p className="text-text-tertiary text-sm">
            Welcome{studentName ? `, ${studentName}` : ""}
          </p>
          <h1 className="text-text text-xl font-medium mt-2">Set up your profile</h1>
          <p className="text-text-secondary text-sm mt-1">
            Takes about 2 minutes. You can update this later.
          </p>
        </div>

        <section className="space-y-4">
          <div>
            <Label>Resume</Label>
            <p className="text-text-tertiary text-xs">PDF or Word doc</p>
          </div>
          <div className="border border-border border-dashed rounded px-4 py-6 text-center text-text-secondary text-sm">
            <p>Drop your resume here</p>
            <p className="text-text-tertiary text-xs mt-2">or browse files</p>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              className="mt-4"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </div>
          {file ? (
            <p className="text-text-secondary text-xs font-mono">{file.name}</p>
          ) : null}
        </section>

        <section className="space-y-4">
          <Label>Graduation year</Label>
          <div className="flex gap-3">
            {[2026, 2027].map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setGraduationYear(year as 2026 | 2027)}
                className={`px-4 py-2 border rounded text-sm ${
                  graduationYear === year
                    ? "bg-white text-black border-white"
                    : "border-border text-text-secondary"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          <Label>Employment type</Label>
          <div className="flex gap-3 flex-wrap">
            {[
              { value: "full_time", label: "Full-time" },
              { value: "internship", label: "Internship" },
              { value: "both", label: "Both" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setEmploymentType(option.value as typeof employmentType)}
                className={`px-4 py-2 border rounded text-sm ${
                  employmentType === option.value
                    ? "bg-white text-black border-white"
                    : "border-border text-text-secondary"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <Label>Industries</Label>
          <p className="text-text-tertiary text-xs">Select all that apply</p>
          <ChipSelect
            options={industries}
            selected={industryInterests}
            onChange={setIndustryInterests}
          />
          <Label>Functions</Label>
          <ChipSelect
            options={functions}
            selected={functionInterests}
            onChange={setFunctionInterests}
          />
        </section>

        <section className="space-y-4">
          <Label>Visa sponsorship</Label>
          <p className="text-text-tertiary text-xs">
            Do you need an employer to sponsor your visa?
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { value: "required", label: "Required" },
              { value: "not_required", label: "Not required" },
              { value: "open", label: "Open" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setSponsorshipPref(option.value as typeof sponsorshipPref)
                }
                className={`border rounded px-3 py-3 text-sm ${
                  sponsorshipPref === option.value
                    ? "border-white text-text"
                    : "border-border text-text-secondary"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {error ? <p className="text-destructive text-xs">{error}</p> : null}

        <Button
          type="submit"
          className="w-full"
          disabled={!file || !graduationYear || loading}
        >
          {loading ? "Saving..." : "Find my opportunities →"}
        </Button>
      </form>
    </main>
  );
}
