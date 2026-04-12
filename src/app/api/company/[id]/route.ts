import { NextRequest, NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabase-server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { data: company } = await supabaseServer
    .from("companies")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!company) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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

  return NextResponse.json({
    company,
    news: newsRes.data || [],
    alumni: alumniRes.data || [],
    skills,
    courses: courses || [],
    jobs: jobsRes.data || [],
  });
}
