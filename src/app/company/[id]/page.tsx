import Link from "next/link";

import { supabaseServer } from "@/lib/supabase-server";

export default async function CompanyPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: company } = await supabaseServer
    .from("companies")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!company) {
    return (
      <div className="max-w-[600px] mx-auto animate-fade-in">
        <p className="text-text-secondary">Company not found.</p>
      </div>
    );
  }

  const [newsRes, alumniRes, skillsRes, jobsRes] = await Promise.all([
    supabaseServer
      .from("company_news")
      .select("*")
      .eq("company_id", company.id)
      .order("date", { ascending: false })
      .limit(5),
    supabaseServer
      .from("alumni")
      .select("id, first_name, last_name, title, graduation_year, linkedin_url")
      .ilike("company_name", company.name)
      .limit(8),
    supabaseServer.from("skills").select("skill").eq("company_id", company.id),
    supabaseServer
      .from("opportunities")
      .select("id, role_title, application_link")
      .eq("company_name", company.name)
      .limit(5),
  ]);

  const skills = skillsRes.data || [];
  const { data: courses } = await supabaseServer
    .from("courses")
    .select("course_code, course_title, skill")
    .in(
      "skill",
      skills.map((skill) => skill.skill),
    );
  const news = newsRes.data || [];
  const alumni = alumniRes.data || [];
  const jobs = jobsRes.data || [];
  const coursesList = courses || [];

  return (
    <div className="max-w-[900px] mx-auto animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-text-tertiary text-sm font-mono">Company profile</p>
          <h1 className="text-text text-2xl font-semibold">{company.name}</h1>
          <p className="text-text-secondary text-sm">
            {company.headquarters} · {company.stage}
          </p>
        </div>
        <Link href="/feed" className="text-text-tertiary text-sm underline">
          Back to feed
        </Link>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="border border-border rounded p-5">
          <h2 className="text-text text-sm font-medium mb-2">Overview</h2>
          <p className="text-text-secondary text-sm">{company.overview}</p>
        </div>

        <div className="border border-border rounded p-5">
          <h2 className="text-text text-sm font-medium mb-2">Open roles</h2>
          <ul className="text-text-secondary text-sm space-y-2">
            {jobs.length === 0 ? (
              <li>No roles available.</li>
            ) : (
              jobs.map((job) => (
                <li key={job.id}>
                  {job.role_title} ·{" "}
                  <a
                    href={job.application_link}
                    className="text-text-tertiary underline"
                  >
                    Apply →
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="border border-border rounded p-5">
          <h2 className="text-text text-sm font-medium mb-2">Recent news</h2>
          <ul className="text-text-secondary text-sm space-y-2">
            {news.length === 0 ? (
              <li>No news yet.</li>
            ) : (
              news.map((item) => (
                <li key={item.id}>
                  <a href={item.url} className="underline">
                    {item.headline}
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="border border-border rounded p-5">
          <h2 className="text-text text-sm font-medium mb-2">Columbia alumni</h2>
          <ul className="text-text-secondary text-sm space-y-2">
            {alumni.length === 0 ? (
              <li>No alumni data available yet.</li>
            ) : (
              alumni.map((alum) => (
                <li key={alum.id}>
                  {alum.first_name} {alum.last_name} · {alum.title} · '
                  {String(alum.graduation_year).slice(-2)} ·{" "}
                  <a href={alum.linkedin_url} className="underline">
                    LinkedIn →
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="border border-border rounded p-5">
          <h2 className="text-text text-sm font-medium mb-2">Skills required</h2>
          <div className="flex flex-wrap gap-2">
            {skills.length === 0 ? (
              <p className="text-text-secondary text-sm">No skills listed.</p>
            ) : (
              skills.map((skill) => (
                <span
                  key={skill.skill}
                  className="border border-border px-2 py-1 text-xs font-mono text-text-secondary"
                >
                  {skill.skill}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="border border-border rounded p-5">
          <h2 className="text-text text-sm font-medium mb-2">CBS courses</h2>
          <ul className="text-text-secondary text-sm space-y-2">
            {coursesList.length === 0 ? (
              <li>No courses mapped yet.</li>
            ) : (
              coursesList.map((course) => (
                <li key={course.course_code}>
                  {course.course_code} · {course.course_title}
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
