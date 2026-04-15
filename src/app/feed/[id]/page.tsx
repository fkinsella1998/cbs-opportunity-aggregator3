import Link from "next/link";

import OpportunityActions from "@/components/feed/OpportunityActions";
import { formatDeadline, timeAgo } from "@/lib/dates";
import { buildMockOpportunities } from "@/lib/mock-opportunities";
import { getSession } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase-server";

export default async function OpportunityDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const session = await getSession();
  const isPreview =
    !params.id || params.id === "preview" || params.id === "undefined";

  const getParam = (key: string) => {
    const value = searchParams?.[key];
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

  if (error && !isPreview) {
    return (
      <div className="max-w-[600px] mx-auto animate-fade-in">
        <p className="text-text-secondary">
          Unable to load opportunity: {error.message}
        </p>
      </div>
    );
  }

  const resolvedOpportunity = opportunity ?? {
    ...mockOpportunity,
    ...queryFallbackOpportunity,
    id: "preview",
    role_title: queryFallbackOpportunity.role_title ?? mockOpportunity.role_title ?? "Preview role",
    company_name:
      queryFallbackOpportunity.company_name ?? mockOpportunity.company_name ?? "Preview company",
    description:
      queryFallbackOpportunity.description ??
      mockOpportunity.description ??
      "Opportunity details coming soon.",
    application_link:
      queryFallbackOpportunity.application_link ??
      mockOpportunity.application_link ??
      "#",
    went_live_at:
      queryFallbackOpportunity.went_live_at ??
      mockOpportunity.went_live_at ??
      new Date().toISOString(),
    source: queryFallbackOpportunity.source ?? mockOpportunity.source ?? "CMC",
  };

  if (!resolvedOpportunity) {
    return (
      <div className="max-w-[600px] mx-auto animate-fade-in">
        <p className="text-text-secondary">Opportunity not found.</p>
      </div>
    );
  }

  const studentId = session.student_id;
  const [alumniRes, bookmarkRes, applicationRes] = await Promise.all([
    supabaseServer
      .from("alumni")
      .select(
        "id, first_name, last_name, title, linkedin_url, graduation_year, email",
      )
      .ilike("company_name", resolvedOpportunity.company_name)
      .limit(10),
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
        <h1 className="text-text text-2xl font-semibold">
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
          About the role
        </p>
        <p className="mt-3 text-text-secondary text-sm leading-7">
          {resolvedOpportunity.description}
        </p>
      </div>

      <div className="mt-8 text-xs font-mono text-text-tertiary">
        Posted {timeAgo(resolvedOpportunity.went_live_at)} · Via{" "}
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
