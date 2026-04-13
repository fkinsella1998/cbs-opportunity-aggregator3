import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const session = await getSession();
  if (!session.student_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabaseServer
    .from("profiles")
    .select("*")
    .eq("student_id", session.student_id)
    .single();

  return NextResponse.json({
    student: {
      id: session.student_id,
      email: session.email,
      first_name: session.first_name,
      last_name: session.last_name,
      onboarding_done: session.onboarding_done,
    },
    profile,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.student_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();
  const { error } = await supabaseServer.from("profiles").upsert(
    {
      student_id: session.student_id,
      ...payload,
    },
    { onConflict: "student_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabaseServer
    .from("students")
    .update({ onboarding_done: true })
    .eq("id", session.student_id);

  session.onboarding_done = true;
  await session.save();

  return NextResponse.json({ success: true });
}
