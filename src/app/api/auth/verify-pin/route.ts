import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { getSession } from "@/lib/session";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
);

export async function POST(req: NextRequest) {
  const { email, pin } = (await req.json()) as { email?: string; pin?: string };

  if (!email || !pin) {
    return NextResponse.json({ error: "Email and PIN required" }, { status: 400 });
  }

  const normalized = email.toLowerCase().trim();
  const { data: student } = await supabase
    .from("public.students")
    .select(
      "id, email, first_name, last_name, pin_hash, pin_expires_at, onboarding_done",
    )
    .eq("email", normalized)
    .single();

  if (!student || !student.pin_hash) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  if (
    !student.pin_expires_at ||
    new Date(student.pin_expires_at) < new Date()
  ) {
    return NextResponse.json(
      { error: "Code expired. Request a new one." },
      { status: 401 },
    );
  }

  const valid = await bcrypt.compare(pin, student.pin_hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  await supabase
    .from("public.students")
    .update({ pin_hash: null, pin_expires_at: null })
    .eq("id", student.id);

  const token = crypto.randomBytes(32).toString("hex");
  await supabase.from("public.sessions").insert({
    student_id: student.id,
    token,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const session = await getSession();
  session.student_id = student.id;
  session.email = student.email;
  session.first_name = student.first_name;
  session.last_name = student.last_name;
  session.onboarding_done = student.onboarding_done;
  await session.save();

  return NextResponse.json({
    success: true,
    onboarding_done: student.onboarding_done,
  });
}
