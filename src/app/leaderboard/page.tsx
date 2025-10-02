// app/leaderboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Row = { handle: string; total: number; updated_at: string };

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { fetch("/api/leaderboard?limit=100").then(r => r.json()).then(d => setRows(d.leaderboard || [])); }, []);
  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">🏆 Top POPDOG Accounts</h2>
        <Link
          href="/"
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm sm:text-base"
        >
          ← Back Home
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No one has popped yet! Be the first! 🐶</p>
      ) : (
        <ol className="divide-y border rounded-lg">
          {rows.map((r, i) => (
            <li key={r.handle} className="flex justify-between py-2 px-3 sm:py-4 sm:px-6 hover:bg-gray-50">
              <span className="font-mono text-base sm:text-lg">
                <span className="text-gray-500 mr-2 sm:mr-3">#{i + 1}</span>
                @{r.handle}
              </span>
              <span className="font-bold text-lg sm:text-xl">{r.total.toLocaleString()} pops</span>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
