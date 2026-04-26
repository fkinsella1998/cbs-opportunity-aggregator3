import Link from "next/link";

import OpportunityActions from "@/components/feed/OpportunityActions";
import { cardPostedLabel, formatDeadline, formatPostedDate } from "@/lib/dates";
import { buildMockOpportunities } from "@/lib/mock-opportunities";
import { getSession } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase-server";
import type { PeerProfile, Professor } from "@/types";

export default async function OpportunityDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const session = await getSession();
  const isPreview = params.id === "preview" || params.id === "undefined";
  const resolvedSearchParams = await Promise.resolve(searchParams);

  const getParam = (key: string) => {
    const value = resolvedSearchParams?.[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const queryFallbackOpportunity = {
    id: "preview",
    role_title: getParam("role_title") ?? undefined,
    company_name: getParam("company_name") ?? undefined,
    function: getParam("function") ?? undefined,
    company_stage: getParam("company_stage") ?? undefined,
    employment_type: getParam("employment_type") ?? undefined,
    location: getParam("location") ?? undefined,
    description: getParam("description") ?? undefined,
    application_link: getParam("application_link") ?? undefined,
    application_deadline: getParam("application_deadline") ?? undefined,
    has_cbs_alumni: (getParam("has_cbs_alumni") ?? undefined) as
      | "Yes"
      | "No"
      | "Unknown"
      | undefined,
    source: getParam("source") ?? undefined,
    went_live_at: getParam("went_live_at") ?? undefined,
  };
  const mockOpportunity = buildMockOpportunities()[0] ?? {};

  let opportunity = null;
  let error = null;

  if (!isPreview) {
    const response = await supabaseServer
      .from("opportunities")
      .select("*")
      .eq("id", params.id)
      .single();
    opportunity = response.data;
    error = response.error;
  }

  const hasQueryFallback =
    Boolean(queryFallbackOpportunity.role_title) ||
    Boolean(queryFallbackOpportunity.company_name) ||
    Boolean(queryFallbackOpportunity.description);
  const fallbackBase = hasQueryFallback ? queryFallbackOpportunity : mockOpportunity;

  const resolvedOpportunity = opportunity ?? {
    ...mockOpportunity,
    ...fallbackBase,
    id: "preview",
    role_title:
      fallbackBase.role_title ?? mockOpportunity.role_title ?? "Preview role",
    company_name:
      fallbackBase.company_name ?? mockOpportunity.company_name ?? "Preview company",
    description:
      fallbackBase.description ??
      mockOpportunity.description ??
      "Opportunity details coming soon.",
    application_link:
      fallbackBase.application_link ?? mockOpportunity.application_link ?? "#",
    went_live_at:
      fallbackBase.went_live_at ??
      mockOpportunity.went_live_at ??
      new Date().toISOString(),
    source: fallbackBase.source ?? mockOpportunity.source ?? "CMC",
  };

  const studentId = session.student_id;
  const normalize = (value: string) => value.trim().toLowerCase();
  const industryFallbackMap: Record<string, string> = {
    finance: "Finance & FinTech",
    strategy: "Technology",
    operations: "Consumer & Retail",
    marketing: "Media & Entertainment",
    product: "Technology",
    analytics: "Technology",
    sustainability: "Climate & Energy",
    "business development": "Technology",
  };
  const rawIndustry =
    (resolvedOpportunity as { industry?: string }).industry ??
    resolvedOpportunity.function ??
    null;
  const industryMatch =
    rawIndustry && industryFallbackMap[normalize(rawIndustry)]
      ? industryFallbackMap[normalize(rawIndustry)]
      : rawIndustry;

  const [alumniRes, professorsRes, peersRes, bookmarkRes, applicationRes] =
    await Promise.all([
    supabaseServer
      .from("alumni")
      .select(
        "id, first_name, last_name, title, linkedin_url, graduation_year, email",
      )
      .ilike("company_name", resolvedOpportunity.company_name)
      .limit(10),
    industryMatch
      ? supabaseServer
          .from("professors")
          .select(
            "professor_id, first_name, last_name, department, bio, columbia_profile_url, industry_tags, is_open_to_outreach",
          )
          .contains("industry_tags", [industryMatch])
          .order("is_open_to_outreach", { ascending: false })
          .limit(3)
      : Promise.resolve({ data: [] }),
    industryMatch
      ? supabaseServer
          .from("peers")
          .select(
            "peer_id, first_name, last_name, program, graduation_year, current_company, linkedin_url, industry_tags",
          )
          .contains("industry_tags", [industryMatch])
          .limit(3)
      : Promise.resolve({ data: [] }),
    studentId && opportunity
      ? supabaseServer
          .from("bookmarks")
          .select("is_active")
          .eq("student_id", studentId)
          .eq("opportunity_id", params.id)
          .single()
      : Promise.resolve({ data: null }),
    studentId && opportunity
      ? supabaseServer
          .from("applications")
          .select("id")
          .eq("student_id", studentId)
          .eq("opportunity_id", params.id)
          .single()
      : Promise.resolve({ data: null }),
  ]);
  const alumni = alumniRes.data || [];
  const professors = (professorsRes.data as Professor[] | null) || [];
  const peers = (peersRes.data as PeerProfile[] | null) || [];
  const mockAlumni = [
    {
      id: "preview-alum-1",
      first_name: "Jordan",
      last_name: "Lee",
      title: "Senior Product Manager",
      email: "jordan.lee@alumni.cbs.edu",
      linkedin_url: "https://www.linkedin.com/",
      graduation_year: 2020,
    },
    {
      id: "preview-alum-2",
      first_name: "Avery",
      last_name: "Patel",
      title: "Investment Associate",
      email: "avery.patel@alumni.cbs.edu",
      linkedin_url: "https://www.linkedin.com/",
      graduation_year: 2019,
    },
  ];
  const alumniList = alumni.length > 0 ? alumni : mockAlumni;
  const bookmark = bookmarkRes.data;
  const application = applicationRes.data;

  return (
    <div className="max-w-[600px] mx-auto animate-fade-in">
      <Link
        href="/feed"
        className="text-text-tertiary text-sm underline underline-offset-2"
      >
        ← Back
      </Link>
      <div className="mt-6">
        <h1 className="text-accent text-2xl font-semibold">
          {resolvedOpportunity.role_title}
        </h1>
        <p className="text-text-secondary text-base">
          {resolvedOpportunity.company_name}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-[0.08em] text-text-secondary">
          {[
            resolvedOpportunity.function,
            resolvedOpportunity.company_stage,
            resolvedOpportunity.employment_type,
            resolvedOpportunity.location,
          ]
            .filter(Boolean)
            .map((tag) => (
              <span key={tag} className="border border-border px-2 py-1">
                {tag}
              </span>
            ))}
        </div>
      </div>

      <div className="mt-6">
        <a
          href={resolvedOpportunity.application_link ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center bg-white text-black px-6 py-3 text-sm font-medium rounded"
        >
          Apply now →
        </a>
      </div>

      <div className="mt-4">
        <OpportunityActions
          opportunityId={opportunity?.id ?? "preview"}
          initialBookmarked={bookmark?.is_active === true}
          initialApplied={!!application}
        />
      </div>

      {alumniList.length > 0 ? (
        <>
          <div className="mt-8 border-t border-border-subtle pt-6">
            <p className="font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">
              CBS Alumni here
            </p>
            <ul className="mt-3 space-y-2 text-text-secondary text-sm">
              {alumniList.map((alum) => (
                <li key={alum.id}>
                  {alum.first_name} {alum.last_name} · {alum.title} · ‘
                  {String(alum.graduation_year).slice(-2)} ·{" "}
                  <a
                    href={alum.linkedin_url}
                    className="text-text-tertiary underline"
                  >
                    LinkedIn →
                  </a>
                  {alum.email ? (
                    <>
                      {" "}
                      ·{" "}
                      <a
                        href={`mailto:${alum.email}`}
                        className="text-text-tertiary underline"
                      >
                        Email →
                      </a>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}

      <div className="mt-8 border-t border-border-subtle pt-6">
        <p className="font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">
          Relevant Faculty
        </p>
        {professors.length === 0 ? (
          <p className="mt-3 text-text-tertiary text-sm">
            No faculty matches for this industry yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-text-secondary text-sm">
            {professors.map((professor) => (
              <li key={professor.professor_id}>
                <span className="text-text">
                  {professor.first_name} {professor.last_name}
                </span>{" "}
                · {professor.department} · {professor.bio} ·{" "}
                <a
                  href={professor.columbia_profile_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-tertiary underline"
                >
                  View Profile →
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 border-t border-border-subtle pt-6">
        <p className="font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">
          Relevant Peers
        </p>
        {peers.length === 0 ? (
          <p className="mt-3 text-text-tertiary text-sm">
            No peer matches for this industry yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-text-secondary text-sm">
            {peers.map((peer) => (
              <li key={peer.peer_id}>
                <span className="text-text">
                  {peer.first_name} {peer.last_name}
                </span>{" "}
                · {peer.program}
                {peer.graduation_year ? ` ‘${String(peer.graduation_year).slice(-2)}` : ""}
                {peer.current_company ? ` · ${peer.current_company}` : ""} ·{" "}
                <a
                  href={peer.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-tertiary underline"
                >
                  View LinkedIn →
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 border-t border-border-subtle pt-6">
        <p className="font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">
          About the role
        </p>
        <p className="mt-3 text-text-secondary text-sm leading-7">
          {resolvedOpportunity.description}
        </p>
      </div>

      <div className="mt-8 text-xs font-mono text-text-tertiary">
        <span className="text-text-secondary">
          {formatPostedDate(resolvedOpportunity.went_live_at)}
        </span>{" "}
        · {cardPostedLabel(resolvedOpportunity.went_live_at)} · Via{" "}
        {resolvedOpportunity.source}
        {resolvedOpportunity.application_deadline ? (
          <span className="block">
            {formatDeadline(resolvedOpportunity.application_deadline)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
