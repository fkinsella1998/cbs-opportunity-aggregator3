import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
);

function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendPinEmail(email: string, firstName: string, pin: string) {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY ?? "");

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "noreply@columbia.edu",
    to: email,
    subject: "Your CBS Opportunities login code",
    html: `
      <div style="background:#0A0A0A;color:#F0F0F0;font-family:monospace;padding:40px;max-width:400px">
        <p style="color:#888;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:24px">CBS Opportunities</p>
        <p style="font-size:15px;margin-bottom:32px">Hi ${firstName},</p>
        <p style="font-size:15px;margin-bottom:24px">Your login code:</p>
        <p style="font-size:40px;letter-spacing:0.3em;font-weight:600;margin-bottom:32px">${pin}</p>
        <p style="color:#888;font-size:13px">Expires in 15 minutes. Do not share this code.</p>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const normalized = email.toLowerCase().trim();
  const { data: student } = await supabase
    .from("students")
    .select("id, first_name, email")
    .eq("email", normalized)
    .single();

  const studentRecord =
    student ??
    (
      await supabase
        .from("students")
        .insert({
          email: normalized,
          first_name: "CBS",
          last_name: "Student",
        })
        .select("id, first_name, email")
        .single()
    ).data;

  if (!studentRecord) {
    return NextResponse.json(
      { error: "Unable to create student." },
      { status: 500 },
    );
  }

  const pin = generatePin();
  const pinHash = await bcrypt.hash(pin, 10);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await supabase
    .from("students")
    .update({ pin_hash: pinHash, pin_expires_at: expiresAt })
    .eq("id", studentRecord.id);

  if (process.env.RESEND_API_KEY) {
    await sendPinEmail(studentRecord.email, studentRecord.first_name, pin);
  }

  return NextResponse.json({
    message: process.env.RESEND_API_KEY
      ? "If this email is registered, you will receive a PIN shortly."
      : "PIN generated for dev mode.",
    pin: process.env.RESEND_API_KEY ? undefined : pin,
  });
}
