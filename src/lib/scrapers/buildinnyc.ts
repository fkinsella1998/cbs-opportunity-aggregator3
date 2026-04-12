import { chromium } from "playwright";
import { supabaseServer } from "@/lib/supabase-server";

export async function scrapeBuiltInNYC() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let scraped = 0;
  let inserted = 0;
  let errors = 0;

  try {
    await page.goto("https://www.builtinnyc.com/jobs", {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    for (let i = 0; i < 5; i += 1) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1500);
    }

    const jobLinks = await page.$$eval("a[data-id]", (links) =>
      links.map((link) => ({
        href: (link as HTMLAnchorElement).href,
        title:
          link.querySelector('[class*="title"]')?.textContent?.trim() || "",
        company:
          link.querySelector('[class*="company"]')?.textContent?.trim() || "",
        location:
          link.querySelector('[class*="location"]')?.textContent?.trim() || "",
      })),
    );

    scraped = jobLinks.length;

    for (const job of jobLinks.slice(0, 100)) {
      try {
        await page.goto(job.href, { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.waitForTimeout(800);

        const description = await page
          .$(".job-description")
          .then(async (el) => (el ? await el.textContent() : ""))
          .catch(() => "");

        const employmentType = await page
          .$("[class*='employment-type']")
          .then(async (el) => (el ? await el.textContent() : "Full-time"))
          .catch(() => "Full-time");

        const { data: existing } = await supabaseServer
          .from("opportunities")
          .select("id")
          .eq("source_url", job.href)
          .single();

        if (!existing) {
          const { error } = await supabaseServer.from("opportunities").insert({
            company_name: job.company,
            role_title: job.title,
            location: job.location,
            description: description?.slice(0, 500) || "",
            employment_type: employmentType || "Full-time",
            source: "BuildInNYC",
            source_url: job.href,
            status: "Live",
            has_cbs_alumni: "Unknown",
          });

          if (!error) inserted += 1;
        }
      } catch (err) {
        errors += 1;
      }
    }
  } finally {
    await browser.close();
  }

  return { scraped, inserted, errors };
}
