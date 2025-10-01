"use client";

import { signIn } from "next-auth/react";

export default function TwitterLoginButton() {
  return (
    <button
      onClick={() => signIn("twitter", { callbackUrl: "/" })}
      className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors shadow-md"
    >
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      Login with X
    </button>
  );
}
