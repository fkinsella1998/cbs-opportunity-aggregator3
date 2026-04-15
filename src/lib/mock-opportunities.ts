import crypto from "crypto";

import type { Opportunity } from "@/types";

const baseDescription =
  "Work on high-impact projects with direct exposure to leadership, a lean team, and real ownership from day one.";

const seedData: Omit<
  Opportunity,
  | "id"
  | "went_live_at"
  | "view_count"
  | "click_count"
  | "bookmark_count"
  | "application_count"
> = {
  industry: "Technology",
  company_name: "HelioShare",
  role_title: "Growth Strategy Intern",
  function: "Strategy",
  company_stage: "Series A",
  employment_type: "Internship",
  location: "New York, NY",
  description: baseDescription,
  application_link: "https://example.com/jobs/helioshare",
  application_deadline: undefined,
  has_cbs_alumni: "Yes",
  source: "CMC",
  source_url: undefined,
  status: "Live",
};

export function buildMockOpportunities(): Partial<Opportunity>[] {
  const now = new Date().toISOString();
  const makeOpportunity = (
    overrides: Partial<Opportunity>,
  ): Partial<Opportunity> => ({
    ...seedData,
    id: crypto.randomUUID(),
    went_live_at: now,
    ...overrides,
  });

  return [
    makeOpportunity({
      industry: "Technology",
      company_name: "HelioShare",
      role_title: "Growth Strategy Intern",
      function: "Strategy",
      company_stage: "Series A",
      employment_type: "Internship",
      location: "New York, NY",
      application_link: "https://example.com/jobs/helioshare",
    }),
    makeOpportunity({
      industry: "Finance & FinTech",
      company_name: "Altara Capital",
      role_title: "Investment Analyst",
      function: "Finance",
      company_stage: "Growth",
      employment_type: "Full-time",
      location: "New York, NY",
      application_link: "https://example.com/jobs/altara",
      has_cbs_alumni: "Unknown",
    }),
    makeOpportunity({
      industry: "Healthcare & Biotech",
      company_name: "NorthBridge Health",
      role_title: "Product Manager, Digital Health",
      function: "Product",
      company_stage: "Series B",
      employment_type: "Full-time",
      location: "Boston, MA",
      application_link: "https://example.com/jobs/northbridge",
    }),
    makeOpportunity({
      industry: "Technology",
      company_name: "Quanta Commerce",
      role_title: "AI Partnerships Associate",
      function: "Business Development",
      company_stage: "Seed",
      employment_type: "Full-time",
      location: "Remote",
      application_link: "https://example.com/jobs/quanta",
    }),
    makeOpportunity({
      industry: "Consumer & Retail",
      company_name: "Summit Mobility",
      role_title: "Operations & Strategy Intern",
      function: "Operations",
      company_stage: "Series A",
      employment_type: "Internship",
      location: "San Francisco, CA",
      application_link: "https://example.com/jobs/summit",
      has_cbs_alumni: "No",
    }),
    makeOpportunity({
      industry: "Consumer & Retail",
      company_name: "Arcadia Retail",
      role_title: "Merchandising Analyst",
      function: "Analytics",
      company_stage: "Other",
      employment_type: "Full-time",
      location: "Chicago, IL",
      application_link: "https://example.com/jobs/arcadia",
    }),
    makeOpportunity({
      industry: "Climate & Energy",
      company_name: "Bluecrest Energy",
      role_title: "Sustainability Associate",
      function: "Sustainability",
      company_stage: "Series B",
      employment_type: "Full-time",
      location: "Houston, TX",
      application_link: "https://example.com/jobs/bluecrest",
      has_cbs_alumni: "Unknown",
    }),
    makeOpportunity({
      industry: "Technology",
      company_name: "Vista Labs",
      role_title: "Product Marketing Manager",
      function: "Marketing",
      company_stage: "Growth",
      employment_type: "Full-time",
      location: "Remote",
      application_link: "https://example.com/jobs/vista",
    }),
  ];
}
