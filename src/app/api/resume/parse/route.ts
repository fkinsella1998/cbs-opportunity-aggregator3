import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase-server";

const OPENAI_MODEL = "gpt-4o-mini";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.student_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "File required" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const pdfParseModule = await import("pdf-parse");
  const pdfParse =
    (pdfParseModule as unknown as {
      default: (input: Buffer) => Promise<{ text: string }>;
    }).default ?? (pdfParseModule as unknown as (input: Buffer) => Promise<{ text: string }>);
  const parsed = await pdfParse(buffer);

  const prompt = `
System: You are a resume parser. Extract key information. Return ONLY valid JSON, no other text.
{
  "skills": ["up to 20 most relevant skills"],
  "experience": [{"company": "", "title": "", "description": "one sentence max"}],
  "education": [{"school": "", "degree": "", "field": "", "grad_year": 0}],
  "summary": "2-sentence professional summary"
}

User: ${parsed.text}
`;

  let resumeParsed = null;
  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? "" });
    const completion = await client.responses.create({
      model: OPENAI_MODEL,
      input: prompt,
      temperature: 0.2,
    });
    const content = completion.output_text;
    resumeParsed = JSON.parse(content);
  } catch (error) {
    resumeParsed = null;
  }

  const filePath = `${session.student_id}/${Date.now()}-${file.name}`;
  const { data: storageData, error: storageError } = await supabaseServer.storage
    .from("resumes")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  const { data: publicUrl } = supabaseServer.storage
    .from("resumes")
    .getPublicUrl(storageData.path);

  await supabaseServer
    .from("profiles")
    .update({
      resume_url: publicUrl.publicUrl,
      resume_text: parsed.text,
      resume_parsed: resumeParsed,
    })
    .eq("student_id", session.student_id);

  return NextResponse.json({
    resume_url: publicUrl.publicUrl,
    resume_parsed: resumeParsed,
  });
}
