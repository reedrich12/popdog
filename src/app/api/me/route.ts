// app/api/me/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
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

  const url = new URL(req.url);
  const handle = url.searchParams.get("handle");
  if (!handle || !/^[A-Za-z0-9_]{1,15}$/.test(handle)) {
    return NextResponse.json({ error: "Invalid handle" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from("pop_counts")
    .select("total")
    .eq("handle", handle)
    .single();

  if (error) {
    return NextResponse.json({ total: 0 });
  }

  return NextResponse.json({ total: data?.total ?? 0 });
}
