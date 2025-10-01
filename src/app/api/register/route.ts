// app/api/register/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing environment variables:", {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });
    return NextResponse.json(
      { error: "Server configuration error. Please ensure environment variables are set in Vercel dashboard." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({} as any));
  let handle: string = (body.handle || "").replace(/^@/, "");
  if (!/^[A-Za-z0-9_]{1,15}$/.test(handle)) {
    return NextResponse.json({ error: "Invalid handle" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Create or update profile
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ handle }, { onConflict: "handle" });

  if (profileError) {
    console.error("Profile registration error:", profileError);
    return NextResponse.json({ error: `Failed to create profile: ${profileError.message}` }, { status: 500 });
  }

  // Create or update pop_counts with default total of 0
  const { error: countsError } = await supabase
    .from("pop_counts")
    .upsert({ handle, total: 0 }, { onConflict: "handle" });

  if (countsError) {
    console.error("Pop counts initialization error:", countsError);
    return NextResponse.json({ error: `Failed to initialize counter: ${countsError.message}` }, { status: 500 });
  }

  return NextResponse.json({ handle });
}
