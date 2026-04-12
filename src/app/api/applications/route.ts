import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.student_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { opportunity_id } = (await req.json()) as { opportunity_id?: string };
  if (!opportunity_id) {
    return NextResponse.json({ error: "opportunity_id required" }, { status: 400 });
  }

  const { data: existing } = await supabaseServer
    .from("applications")
    .select("id")
    .eq("student_id", session.student_id)
    .eq("opportunity_id", opportunity_id)
    .single();

  if (existing) {
    await supabaseServer.from("applications").delete().eq("id", existing.id);
    await supabaseServer.rpc("decrement_application_count", {
      opp_id: opportunity_id,
    });
    return NextResponse.json({ has_applied: false });
  }

  await supabaseServer.from("applications").insert({
    student_id: session.student_id,
    opportunity_id,
  });
  await supabaseServer.rpc("increment_application_count", {
    opp_id: opportunity_id,
  });

  return NextResponse.json({ has_applied: true });
}
