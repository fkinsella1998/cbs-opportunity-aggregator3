import Link from "next/link";

import { formatDeadline, timeAgo } from "@/lib/dates";
import { supabaseServer } from "@/lib/supabase-server";

export default async function OpportunityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: opportunity } = await supabaseServer
    .from("opportunities")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!opportunity) {
    return (
      <div className="max-w-[600px] mx-auto animate-fade-in">
        <p className="text-text-secondary">Opportunity not found.</p>
      </div>
    );
  }

  const { data: alumni } = await supabaseServer
    .from("alumni")
    .select("id, first_name, last_name, title, linkedin_url, graduation_year")
    .ilike("company_name", opportunity.company_name)
    .limit(10);

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
          {opportunity.role_title}
        </h1>
        <p className="text-text-secondary text-base">
          {opportunity.company_name}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-[0.08em] text-text-secondary">
          {[
            opportunity.function,
            opportunity.company_stage,
            opportunity.employment_type,
            opportunity.location,
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
          href={opportunity.application_link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center bg-white text-black px-6 py-3 text-sm font-medium rounded"
        >
          Apply now →
        </a>
      </div>

      {alumni && alumni.length > 0 ? (
        <>
          <div className="mt-8 border-t border-border-subtle pt-6">
            <p className="font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">
              CBS Alumni here
            </p>
            <ul className="mt-3 space-y-2 text-text-secondary text-sm">
              {alumni.map((alum) => (
                <li key={alum.id}>
                  {alum.first_name} {alum.last_name} · {alum.title} · ‘
                  {String(alum.graduation_year).slice(-2)} ·{" "}
                  <a
                    href={alum.linkedin_url}
                    className="text-text-tertiary underline"
                  >
                    LinkedIn →
                  </a>
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
          {opportunity.description}
        </p>
      </div>

      <div className="mt-8 text-xs font-mono text-text-tertiary">
        Posted {timeAgo(opportunity.went_live_at)} · Via {opportunity.source}
        {opportunity.application_deadline ? (
          <span className="block">
            {formatDeadline(opportunity.application_deadline)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
