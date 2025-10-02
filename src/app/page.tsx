"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

const DOGS = {
  closed: "/dog-closed.png",
  open: "/dog-open.png",
};

const BACKGROUNDS = [
  { id: "white", name: "White", path: "/backgrounds/white.png" },
  { id: "pink", name: "Pink", path: "/backgrounds/pink.png" },
  { id: "pills", name: "Pills", path: "/backgrounds/pills.jpg" },
  { id: "gold", name: "Gold", path: "/backgrounds/gold.jpg" },
  { id: "flowers", name: "Flowers", path: "/backgrounds/flowers.jpg" },
  { id: "money", name: "Money", path: "/backgrounds/money.jpg" },
];

export default function PopDog() {
  const [handle, setHandle] = useState<string>("");
  const [savedHandle, setSavedHandle] = useState<string>("");
  const [mouthOpen, setMouthOpen] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [localPops, setLocalPops] = useState<number>(0);
  const [anonymousId, setAnonymousId] = useState<string>("");
  const [showShareButton, setShowShareButton] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string>("white");

  useEffect(() => {
    // Initialize anonymous ID if not exists
    let anonId = localStorage.getItem("pd.anonId");
    if (!anonId) {
      anonId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("pd.anonId", anonId);
    }
    setAnonymousId(anonId);

    // Reset local pops on page load to prevent cheating
    // Users must submit before leaving/refreshing
    localStorage.setItem("pd.localPops", "0");
    setLocalPops(0);

    // Load saved handle and background
    const h = localStorage.getItem("pd.handle") || "";
    const bg = localStorage.getItem("pd.background") || "white";
    if (h) { setSavedHandle(h); setHandle(h); fetchTotal(h); }
    setSelectedBackground(bg);
  }, []);

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
    setMouthOpen(true);

    // Play pop sound effect
    try {
      const audio = new Audio("/sounds/popdog-pop.wav");
      audio.volume = 0.5; // 50% volume for comfortable listening
      audio.play().catch(() => {}); // Ignore autoplay errors
    } catch (err) {
      // Silently fail if audio not supported
    }

    // Always track locally - no database calls during clicking
    const newLocalCount = localPops + 1;
    setLocalPops(newLocalCount);
    localStorage.setItem("pd.localPops", newLocalCount.toString());

    setTimeout(() => setMouthOpen(false), 140);
  }

  async function claimScore() {
    if (localPops === 0) {
      alert("No local pops to submit!");
      return;
    }

    // If no saved handle, prompt user to enter one
    if (!savedHandle) {
      const userHandle = prompt("Enter your X handle to save your score to the leaderboard:");
      if (!userHandle) return; // User cancelled

      const cleanHandle = userHandle.replace(/^@/, "");
      const isValid = /^[A-Za-z0-9_]{1,15}$/.test(cleanHandle);
      if (!isValid) {
        alert("Invalid X handle. Please use only letters, numbers, and underscores (1-15 characters).");
        return;
      }

      // Register the handle
      const registerRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: cleanHandle })
      });

      if (!registerRes.ok) {
        const error = await registerRes.json().catch(() => ({ error: "Unknown error" }));
        alert(`Failed to register handle: ${error.error || "Please try again"}`);
        return;
      }

      // Save handle to state and localStorage
      setSavedHandle(cleanHandle);
      setHandle(cleanHandle);
      localStorage.setItem("pd.handle", cleanHandle);
    }

    const claimedPops = localPops;
    const handleToUse = savedHandle || handle;

    // Transfer local pops to database using batch API
    try {
      const res = await fetch("/api/pop/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handleToUse, count: localPops })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Unknown error" }));
        alert(`Failed to submit pops: ${error.error || "Please try again"}`);
        return;
      }

      const data = await res.json();

      // Success - clear local pops and update total
      localStorage.setItem("pd.localPops", "0");
      setLocalPops(0);
      setTotal(data.total);
      setShowShareButton(true);
      alert(`🎉 Successfully submitted ${claimedPops} pops to @${handleToUse}!\n\nYour score is now on the leaderboard!`);
    } catch (err) {
      console.error("Claim error:", err);
      alert("Failed to submit pops. Please try again.");
    }
  }

  function shareOnX() {
    const score = savedHandle ? total : localPops;
    const text = `I just got ${score} pops on @popdogcoin_! 🐶\n\nThink you can beat my score? Play now: ${window.location.origin}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(tweetUrl, "_blank", "width=550,height=420");
  }

  function selectBackground(bgId: string) {
    setSelectedBackground(bgId);
    localStorage.setItem("pd.background", bgId);
  }

  const currentBg = BACKGROUNDS.find(bg => bg.id === selectedBackground) || BACKGROUNDS[0];
  const backgroundStyle = {
    backgroundImage: `url(${currentBg.path})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8"
         style={backgroundStyle}>
      <Image
        src="/popdog-logo.png"
        alt="POPDOG"
        width={500}
        height={100}
        priority
      />

      <button aria-label="Pop the dog" onClick={pop} className="focus:outline-none active:scale-95 transition">
        <Image src={mouthOpen ? DOGS.open : DOGS.closed} alt="Popdog" width={420} height={420} priority />
      </button>

      <div className="text-2xl rounded-full bg-white/90 backdrop-blur-sm px-6 py-3 shadow-lg border-2 border-black/20">
        {localPops > 0 ? (
          <>
            Local Pops <b>{localPops}</b>
            <span className="ml-2 text-sm text-gray-600">(not saved)</span>
          </>
        ) : savedHandle && total > 0 ? (
          <>
            Leaderboard Score <b>{total}</b>
          </>
        ) : (
          <>
            Total Pops <b>0</b>
          </>
        )}
      </div>

      {localPops > 0 && (
        <button
          onClick={claimScore}
          className="px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors shadow-md"
        >
          💾 Submit {localPops} {localPops === 1 ? "Pop" : "Pops"} to Leaderboard
        </button>
      )}

      {savedHandle && total > 0 && localPops === 0 && (
        <button
          onClick={shareOnX}
          className="px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors shadow-md flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </button>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/leaderboard"
          className="text-lg font-semibold bg-black/80 text-white hover:bg-black/90 px-6 py-3 rounded-full shadow-lg transition-all backdrop-blur-sm"
        >
          🏆 View Leaderboard
        </Link>

        <Link
          href="/about"
          className="text-lg font-semibold bg-[#d4c4b0] text-black hover:bg-[#c4b4a0] px-8 py-3 rounded-full shadow-lg transition-all"
        >
          ABOUT $POPDOG
        </Link>
      </div>

      {!savedHandle && (
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

      {/* Background Selector */}
      <div className="flex flex-col items-center gap-3">
        <label className="text-sm font-semibold bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-sm shadow-md">Choose Background:</label>
        <div className="flex items-center gap-3">
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              onClick={() => selectBackground(bg.id)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-4 transition-all hover:scale-110 ${
                selectedBackground === bg.id ? "border-blue-500 shadow-lg" : "border-gray-300"
              }`}
              aria-label={`Select ${bg.name} background`}
              title={bg.name}
            >
              <Image
                src={bg.path}
                alt={bg.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Social Links Footer */}
      <div className="mt-12 flex flex-col items-center gap-4 pb-8 bg-black/70 backdrop-blur-sm px-8 py-6 rounded-3xl shadow-xl">
        <h3 className="text-lg font-semibold text-white">Follow POPDOG</h3>
        <div className="flex items-center gap-6">
          {/* TikTok */}
          <a
            href="https://tiktok.com/@popdogsol"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-400 transition-colors"
            aria-label="TikTok"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>

          {/* X (Twitter) */}
          <a
            href="https://x.com/popdogcoin_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-400 transition-colors"
            aria-label="X (Twitter)"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* DEX Screener */}
          <a
            href="https://dexscreener.com/solana/9GabD5D84QZjyMEaien1ZLohpgffGbtjDzNAMwBDs7i6"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white/90 hover:bg-white rounded-lg text-sm font-semibold text-gray-800 transition-colors shadow-md"
            aria-label="DEX Screener"
          >
            📊 DEX Screener
          </a>
        </div>
      </div>

    </div>
  );
}
