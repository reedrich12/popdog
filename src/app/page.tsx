"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import TwitterLoginButton from "@/components/TwitterLoginButton";
import Link from "next/link";

const DOGS = {
  closed: "/dog-closed.png",
  open: "/dog-open.png",
};

export default function PopDog() {
  const { data: session, status } = useSession();
  const [handle, setHandle] = useState<string>("");
  const [savedHandle, setSavedHandle] = useState<string>("");
  const [mouthOpen, setMouthOpen] = useState(false);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    // If logged in with Twitter, use Twitter handle
    if (session?.user?.handle) {
      const twitterHandle = session.user.handle;
      setSavedHandle(twitterHandle);
      setHandle(twitterHandle);
      localStorage.setItem("pd.handle", twitterHandle);
      fetchTotal(twitterHandle);
    } else {
      // Fall back to localStorage
      const h = localStorage.getItem("pd.handle") || "";
      const bg = localStorage.getItem("pd.bg");
      if (h) { setSavedHandle(h); setHandle(h); fetchTotal(h); }
      if (bg) document.documentElement.style.setProperty("--bg", bg);
    }
  }, [session]);

  async function fetchTotal(h: string) {
    const res = await fetch(`/api/me?handle=${h}`);
    if (res.ok) {
      const { total } = await res.json();
      setTotal(total ?? 0);
    }
  }

  async function saveHandle() {
    const h = handle.replace(/^@/, "");
    const ok = /^[A-Za-z0-9_]{1,15}$/.test(h);
    if (!ok) return alert("Invalid X handle");
    const res = await fetch("/api/register", { method: "POST", body: JSON.stringify({ handle: h }) });
    if (res.ok) { setSavedHandle(h); localStorage.setItem("pd.handle", h); fetchTotal(h); }
  }

  async function pop() {
    if (!savedHandle) return alert("Enter your X handle first");

    // Optimistic update - increment immediately for better UX
    setTotal((prev) => prev + 1);
    setMouthOpen(true);

    try {
      const res = await fetch("/api/pop", { method: "POST", body: JSON.stringify({ handle: savedHandle }) });
      if (res.ok) {
        const data = await res.json();
        // Update with server value to stay in sync
        setTotal(data.total);
      } else {
        // Rollback on error
        const error = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("Pop failed:", error);
        setTotal((prev) => Math.max(0, prev - 1));
        alert(`Failed to save pop: ${error.error || "Please try again"}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      setTotal((prev) => Math.max(0, prev - 1));
      alert("Network error - pop not saved");
    }

    setTimeout(() => setMouthOpen(false), 140);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8"
         style={{ background: "var(--bg, #ffffff)" }}>
      <h1 className="text-5xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent">POPDOG</span>
      </h1>

      <button aria-label="Pop the dog" onClick={pop} className="focus:outline-none active:scale-95 transition">
        <Image src={mouthOpen ? DOGS.open : DOGS.closed} alt="Popdog" width={420} height={420} priority />
      </button>

      <div className="text-2xl rounded-full border px-6 py-2 shadow-sm">Total Pops <b>{total}</b></div>

      <Link
        href="/leaderboard"
        className="text-lg font-semibold text-blue-600 hover:text-blue-800 underline"
      >
        🏆 View Leaderboard
      </Link>

      {!session ? (
        <TwitterLoginButton />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="text-sm text-gray-700">
            Logged in as <b>@{session.user.handle}</b>
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      )}

      {!session && (
        <div className="flex items-center gap-2">
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@yourhandle"
            className="border rounded-lg px-3 py-2"
            aria-label="X handle"
          />
          <button onClick={saveHandle} className="rounded-lg px-4 py-2 bg-black text-white">Save</button>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <label>Background:</label>
        <input type="color" onChange={(e) => { localStorage.setItem("pd.bg", e.target.value); document.documentElement.style.setProperty("--bg", e.target.value); }} />
      </div>
    </div>
  );
}
