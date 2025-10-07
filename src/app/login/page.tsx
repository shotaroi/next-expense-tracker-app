"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await signIn("credentials", {
      email,
      password,
      redirect: true, // NextAuth handles navigation
      callbackUrl: "/", // where to land after login
    });
  }

  return (
    <main className="max-w-sm mx-auto p-6">
      <form onSubmit={onSubmit} className="space-y-3 border rounded p-4">
        <h1 className="text-xl font-bold">Sign in</h1>

        <label className="block text-sm">
            <span className="mb-1 block"> Email</span>
            <input type="email" className="border rounded w-full px-2 py-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
   
        <label className="block text-sm">
            <span className="mb-1 block">Password</span>
            <input type="password" className="border rounded w-full px-2 py-1" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        <button type="submit" disabled={loading} className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-50">
            {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href={"/signup"} className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </form>
    </main>

  );
}
