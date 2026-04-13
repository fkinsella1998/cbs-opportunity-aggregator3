import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.student_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();

  const { data: contributor } = await supabaseServer
    .from("contributors")
    .select("id, requires_approval, source_tag")
    .eq("email", session.email)
    .single();

  if (!contributor) {
    return NextResponse.json(
      { error: "You don't have contributor access. Contact the CMC to request it." },
      { status: 403 },
    );
  }

  const status = contributor.requires_approval ? "Pending" : "Live";
  const { error } = await supabaseServer.from("opportunities").insert({
    ...payload,
    source: contributor.source_tag,
    contributor_id: contributor.id,
    status,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    status,
  });
}
