// app/api/register/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));
  let handle: string = (body.handle || "").replace(/^@/, "");
  if (!/^[A-Za-z0-9_]{1,15}$/.test(handle)) {
    return NextResponse.json({ error: "Invalid handle" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from("profiles").upsert({ handle });
  await supabase.from("pop_counts").upsert({ handle });

  return NextResponse.json({ handle });
}
