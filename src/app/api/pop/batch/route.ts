// app/api/pop/batch/route.ts
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

  const { handle, count } = await req.json().catch(() => ({} as any));

  // Validate inputs
  if (!handle || !/^[A-Za-z0-9_]{1,15}$/.test(handle)) {
    return NextResponse.json({ error: "Invalid handle" }, { status: 400 });
  }

  if (!count || typeof count !== "number" || count <= 0 || count > 1000000) {
    return NextResponse.json({ error: "Invalid count (must be 1-1000000)" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Ensure profile exists
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ handle }, { onConflict: "handle" });

  if (profileError) {
    console.error("Profile upsert error:", profileError);
    return NextResponse.json({ error: `Failed to create profile: ${profileError.message}` }, { status: 500 });
  }

  // Get current count
  const { data: currentData, error: fetchError } = await supabase
    .from("pop_counts")
    .select("total")
    .eq("handle", handle)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is "not found", which is okay
    console.error("Fetch error:", fetchError);
    return NextResponse.json({ error: `Failed to fetch count: ${fetchError.message}` }, { status: 500 });
  }

  const currentTotal = currentData?.total || 0;
  const newTotal = currentTotal + count;

  // Update or insert the new count
  const { error: upsertError } = await supabase
    .from("pop_counts")
    .upsert(
      { handle, total: newTotal, updated_at: new Date().toISOString() },
      { onConflict: "handle" }
    );

  if (upsertError) {
    console.error("Upsert error:", upsertError);
    return NextResponse.json({ error: `Failed to update count: ${upsertError.message}` }, { status: 500 });
  }

  return NextResponse.json({ handle, total: newTotal });
}
