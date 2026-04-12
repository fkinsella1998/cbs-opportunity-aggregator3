import axios from "axios";

import { supabaseServer } from "@/lib/supabase-server";

export async function scrapeTrueUp(query = "startup jobs New York") {
  const response = await axios.get("https://serpapi.com/search.json", {
    params: {
      engine: "google_jobs",
      q: query,
      location: "New York, NY",
      api_key: process.env.SERPAPI_KEY,
      num: 50,
    },
  });

  const jobs = response.data.jobs_results || [];
  let inserted = 0;

  for (const job of jobs) {
    const source = job.via?.toLowerCase() ?? "";
    const isRelevant =
      source.includes("trueup") ||
      source.includes("startup") ||
      source.includes("builtinnyc");

    if (!isRelevant) continue;

    const { data: existing } = await supabaseServer
      .from("opportunities")
      .select("id")
      .eq("source_url", job.job_link)
      .single();

    if (!existing) {
      await supabaseServer.from("opportunities").insert({
        company_name: job.company_name,
        role_title: job.title,
        location: job.location,
        description: job.description?.slice(0, 500) || "",
        source: "TrueUp",
        source_url: job.job_link,
        status: "Live",
        has_cbs_alumni: "Unknown",
      });
      inserted += 1;
    }
  }

  return { scraped: jobs.length, inserted };
}
