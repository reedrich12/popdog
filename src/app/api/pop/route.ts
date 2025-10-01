// app/api/pop/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Basic in-memory throttle fallback (per instance). For prod, use Redis or Supabase fn.
const windowMs = 10000; // 10 seconds
const maxPopsPerWindow = 20; // 20 pops per window
const buckets = new Map<string, { count: number; reset: number }>();

function throttle(key: string) {
  const now = Date.now();
  const b = buckets.get(key) ?? { count: 0, reset: now + windowMs };
  if (now > b.reset) { b.count = 0; b.reset = now + windowMs; }
  b.count += 1; buckets.set(key, b);
  return b.count <= maxPopsPerWindow;
}

export async function POST(req: Request) {
  const { handle } = await req.json().catch(() => ({} as any));
  const ip = req.headers.get("x-forwarded-for") || "0.0.0.0";
  if (!handle || !/^[A-Za-z0-9_]{1,15}$/.test(handle)) {
    return NextResponse.json({ error: "Invalid handle" }, { status: 400 });
  }
  const throttleKey = `${ip}:${handle}`;
  if (!throttle(throttleKey)) {
    return NextResponse.json({
      error: "Whoa there! You're popping too fast! Take a breather and try again in a few seconds. 🐶"
    }, { status: 429 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Ensure profile exists
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ handle }, { onConflict: "handle" });

  if (profileError) {
    console.error("Profile upsert error:", profileError);
    return NextResponse.json({ error: `Failed to create profile: ${profileError.message}` }, { status: 500 });
  }

  // Try to use the RPC function first (if it exists)
  const { data: rpcData, error: rpcError } = await supabase.rpc("increment_pop", { p_handle: handle });

  if (!rpcError) {
    // RPC function worked!
    return NextResponse.json({ handle, total: rpcData });
  }

  // Fallback: RPC function doesn't exist, use direct SQL
  console.log("RPC function not found, using fallback increment method");

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

  const newTotal = (currentData?.total || 0) + 1;

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
