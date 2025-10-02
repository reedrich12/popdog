// app/api/admin/reset/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  // Simple secret key protection
  const { secret } = await req.json().catch(() => ({} as any));

  // Set a secret key in your .env file: ADMIN_RESET_SECRET=your_secret_here
  const ADMIN_SECRET = process.env.ADMIN_RESET_SECRET || "popdog-reset-2025";

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Delete all pop counts
    const { error: countsError } = await supabase
      .from("pop_counts")
      .delete()
      .neq("handle", ""); // Delete all rows

    if (countsError) {
      console.error("Error deleting pop_counts:", countsError);
      return NextResponse.json(
        { error: `Failed to delete pop counts: ${countsError.message}` },
        { status: 500 }
      );
    }

    // Delete all profiles
    const { error: profilesError } = await supabase
      .from("profiles")
      .delete()
      .neq("handle", ""); // Delete all rows

    if (profilesError) {
      console.error("Error deleting profiles:", profilesError);
      return NextResponse.json(
        { error: `Failed to delete profiles: ${profilesError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Leaderboard wiped successfully"
    });
  } catch (err) {
    console.error("Reset error:", err);
    return NextResponse.json(
      { error: "Failed to reset leaderboard" },
      { status: 500 }
    );
  }
}
