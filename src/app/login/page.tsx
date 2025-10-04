// Login page UI

"use client";

import {useState} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";

export default function LoginPage() {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (mode === "signup") {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password, name}),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Sign up failed");
                return
            }
            // fall through to login after signup
        }

        const result = await signIn("credentials", {
            email, password, redirect: false,
        });

        if (result?.error) {
            setError("Invalid email or password");
        } else {
            router.replace("/"); // go to main app
        }
    };

    return (
        <main className="max-w-sm mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">{mode === "login" ? "Log in" : "Sing up"}</h1>

            <form onSubmit={handleSubmit} className="space-y-3 border rounded p-4">
                {mode === "signup" && (
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-2 py-1" />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-2 py-1" />
                </div>

                <button className="w-full bg-blue-600 rounded text-white hover:bg-blue-700 py-2">
                    {mode === "login" ? "Log in" : "Create account"}
                </button>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button type="button" onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))} className="text-sm text-blue-600 hover:underline" >
                    {mode === "login" ? "No account? Sign up" : "Have an account? Log in"}
                </button>
            </form>
        </main>
    )
}