// app/leaderboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Row = { handle: string; total: number; updated_at: string };

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { fetch("/api/leaderboard?limit=100").then(r => r.json()).then(d => setRows(d.leaderboard || [])); }, []);
  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">🏆 Top POPDOG Accounts</h2>
        <Link
          href="/"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          ← Back Home
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No one has popped yet! Be the first! 🐶</p>
      ) : (
        <ol className="divide-y border rounded-lg">
          {rows.map((r, i) => (
            <li key={r.handle} className="flex justify-between py-4 px-6 hover:bg-gray-50">
              <span className="font-mono text-lg">
                <span className="text-gray-500 mr-3">#{i + 1}</span>
                @{r.handle}
              </span>
              <span className="font-bold text-xl">{r.total.toLocaleString()} pops</span>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
