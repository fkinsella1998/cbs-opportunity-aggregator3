import { NextRequest, NextResponse } from "next/server";

import { scrapeBuiltInNYC } from "@/lib/scrapers/buildinnyc";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.SCRAPER_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await scrapeBuiltInNYC();
  return NextResponse.json(result);
}
