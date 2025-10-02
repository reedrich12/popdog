"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Zen Japanese Sunrise Background Component
const ZenSunriseBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Sunrise Gradient Sky */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#FF6B35] via-[#F7931E] to-[#FDB44B]" />

    {/* Popdog as Sun */}
    <div className="absolute top-[25%] left-1/2 -translate-x-1/2">
      <div className="relative w-56 h-56 rounded-full bg-gradient-radial from-[#FFE66D] to-[#FDB44B] shadow-[0_0_100px_rgba(255,230,109,0.6)] flex items-center justify-center">
        <Image
          src="/dog-closed.png"
          alt="Popdog Sun"
          width={200}
          height={200}
          className="relative z-10"
        />
      </div>
    </div>

    {/* Mountain Layers - SVG */}
    <svg className="absolute bottom-0 w-full h-[60%]" viewBox="0 0 1200 400" preserveAspectRatio="none">
      {/* Back mountains (lightest) */}
      <path
        d="M0,400 L0,200 Q200,150 400,180 T800,200 L1200,220 L1200,400 Z"
        fill="#404040"
        opacity="0.4"
      />

      {/* Middle mountains */}
      <path
        d="M0,400 L0,250 Q300,200 600,240 T1200,260 L1200,400 Z"
        fill="#2d2d2d"
        opacity="0.6"
      />

      {/* Front mountains (darkest) */}
      <path
        d="M0,400 L0,300 Q400,250 800,280 T1200,300 L1200,400 Z"
        fill="#1a1a1a"
        opacity="0.9"
      />
    </svg>
  </div>
);

export default function About() {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    // Page 0: The Origin of $POPDOG
    {
      content: (
        <div className="relative flex flex-col items-center min-h-screen overflow-hidden p-8 pt-64">
          <ZenSunriseBackground />

          {/* Close button */}
          <Link
            href="/"
            className="absolute top-8 right-8 z-10 bg-black/30 hover:bg-black/50 rounded-full p-4 transition-colors backdrop-blur-sm"
            aria-label="Close"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>

          <div className="relative z-10 max-w-3xl space-y-8 bg-black/40 backdrop-blur-md p-8 rounded-3xl text-white mt-auto mb-auto">
            <h1 className="text-5xl font-bold">The Origin of $POPDOG</h1>

            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Every memecoin begins with a moment, and for $POPDOG, that moment came from a real internet dog named Mashu. In a{' '}
                <a
                  href="https://x.com/boku_mashutan/status/1971544393439117428?s=46&t=0vNbvHUy-o7XUCDBg1WVow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  post shared on X
                </a>
                , a picture of Mashu with her mouth popped wide open in a hilarious expression instantly stood out as meme material. That single post became the seed for what would grow into a new character, a new meme, and a new coin.
              </p>

              <p>
                To carry the idea forward, the community refined the image into an original figure, Popdog. No longer just a snapshot of Mashu, Popdog became its own character - bold, unique, and ready to take on the internet in true memecoin fashion.
              </p>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="absolute bottom-1/2 right-12 translate-y-1/2 z-10 bg-blue-600 hover:bg-blue-700 rounded-full p-6 transition-colors shadow-lg"
            aria-label="Next page"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )
    },
    // Page 1: The Backstory
    {
      content: (
        <div className="relative flex flex-col items-center min-h-screen overflow-hidden p-8 pt-64">
          <ZenSunriseBackground />

          {/* Close button */}
          <Link
            href="/"
            className="absolute top-8 right-8 z-10 bg-black/30 hover:bg-black/50 rounded-full p-4 transition-colors backdrop-blur-sm"
            aria-label="Close"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>

          <div className="relative z-10 max-w-3xl space-y-8 bg-black/40 backdrop-blur-md p-8 rounded-3xl text-white mt-auto mb-auto">
            <h1 className="text-5xl font-bold">The Backstory</h1>

            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                $POPDOG was first launched by an anonymous creator on Pump.fun. While the project initially saw little development, the community quickly recognized its potential. A community takeover (CTO) followed, breathing new life into the token and giving it direction as a collective effort.
              </p>

              <p>
                Today, $POPDOG is a memecoin built on that perfect internet moment. A memecoin driven entirely by culture, community, and creativity. What began as a single post will transformed into something much bigger than we can imagine.
              </p>

              <p className="text-2xl font-bold text-yellow-400 pt-8">
                The era of $POPDOG has begun
              </p>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="absolute bottom-1/2 left-12 translate-y-1/2 z-10 bg-blue-600 hover:bg-blue-700 rounded-full p-6 transition-colors shadow-lg"
            aria-label="Previous page"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next button */}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="absolute bottom-1/2 right-12 translate-y-1/2 z-10 bg-blue-600 hover:bg-blue-700 rounded-full p-6 transition-colors shadow-lg"
            aria-label="Next page"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )
    },
    // Page 2: Tokenomics
    {
      content: (
        <div className="relative flex flex-col items-center min-h-screen overflow-hidden p-8 pt-64">
          <ZenSunriseBackground />

          <Link
            href="/"
            className="absolute top-8 right-8 z-10 bg-black/30 hover:bg-black/50 rounded-full p-4 transition-colors backdrop-blur-sm"
            aria-label="Close"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>

          {/* Title and Social Links - Above the sun */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 text-center">
            <h1 className="text-7xl font-bold mb-6 text-white drop-shadow-lg">POPDOG</h1>
            <div className="flex justify-center gap-6">
              <a href="https://t.me/popdogsol" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.038-1.36 5.353-.168.557-.5.743-.82.761-.696.064-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.248-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.441-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.154.232.17.326.016.094.036.308.02.475z"/>
                </svg>
              </a>
              <a href="https://x.com/popdogcoin_" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="relative z-10 max-w-4xl space-y-12 mt-auto mb-auto">

            <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 shadow-xl">
              <p className="text-xl leading-relaxed text-white text-center">
                Popdog is a community-driven memecoin built on the Solana blockchain. Born from a viral moment featuring Mashu the dog, Popdog represents the power of internet culture and collective creativity.
              </p>
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">TOKENOMICS</h2>
              <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 shadow-xl space-y-3 text-left">
                <p className="text-xl font-semibold text-white">0/0 Tax</p>
                <p className="text-xl font-semibold text-white">Liquidity Pool Burnt</p>
                <p className="text-xl font-semibold text-white">Immutable</p>
                <p className="text-xl font-semibold text-white">100% Community Owned</p>
              </div>
              <div className="mt-6">
                <p className="text-sm text-white/80 mb-2 break-all">Contract Address: HYxH3WQHyRAi8z1rMbTzgYDofuXmbkSkWA49YBX4pump</p>
              </div>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="absolute bottom-1/2 left-12 translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full p-6 transition-colors shadow-lg"
            aria-label="Previous page"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next button */}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="absolute bottom-1/2 right-12 translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full p-6 transition-colors shadow-lg"
            aria-label="Next page"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )
    },
    // Page 3: Legal Disclaimer
    {
      content: (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
          <Link
            href="/"
            className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 rounded-full p-4 transition-colors"
            aria-label="Close and return home"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>

          <div className="max-w-4xl space-y-8">
            <h1 className="text-5xl font-bold text-center">Legal Disclaimer</h1>

            <div className="space-y-6 text-lg leading-relaxed text-center">
              <p className="text-xl">
                $POPDOG is a meme coin with no intrinsic value or expectation of financial return. $POPDOG is for entertainment purposes only. When you purchase $POPDOG, you are agreeing that you have seen this disclaimer.
              </p>

              <p className="text-sm text-gray-400 pt-12">
                © 2024 - Popdog
              </p>
            </div>
          </div>

          {/* Back button - last page only has back, no next */}
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="absolute bottom-1/2 left-12 translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full p-6 transition-colors shadow-lg"
            aria-label="Previous page"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return pages[currentPage].content;
}
