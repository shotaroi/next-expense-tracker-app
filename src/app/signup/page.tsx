"use client";

import {useState} from "react";
import {signIn} from "next-auth/react";
import Link from "next/link";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErr(null);

        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password, name}),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to sign up");
            }

            // Auto-login after successful signup
            const result = await signIn("credentials", {
                redirect: true,
                email,
                password,
                callbackUrl: "/",
            });

            // Note: with redirect: true, NextAuth handles navigation.
            // If it returns here, we can optionally check result?.error
        } catch (e: unknown) {
            if (e instanceof Error) setErr(e.message) 
            else setErr("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <form onSubmit={onSubmit}>
                <h1 className="text-xl font-bold">Create your account</h1>

                <label className="block text-sm">
                    <span className="mb-1 block">Name</span>
                    <input className="border rounded w-full px-2 py-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </label>

                <label className="block text-sm">
                    <span className="mb-1 block">Email</span>
                    <input className="border rounded w-full px-2 py-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                </label>

                <label className="block text-sm">
                    <span className="mb-1 block">Password</span>
                    <input className="border rounded w-full px-2 py-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
                </label>

                <button className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-50" type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Sign up"}
                </button>

                {err && <p className="text-sm text-red-600">{err}</p>}

                <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link className="text-blue-600 hover:underline" href={"/login"}>Sign in</Link>
                </p>
            </form>
        </main>
    )

}