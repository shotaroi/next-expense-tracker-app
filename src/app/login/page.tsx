// Login page UI

"use client";

import {useState} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import { main, p } from "framer-motion/client";

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
        <main>
            <h1>{mode === "login" ? "Log in" : "Sing up"}</h1>

            <form onSubmit={handleSubmit}>
                {mode === "signup" && (
                    <div className="">
                        <label>Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                )}
                <div>
                    <label>Email</label>
                    <input type="email" />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" />
                </div>

                <button>
                    {mode === "login" ? "Log in" : "Create account"}
                </button>

                {error && <p>{error}</p>}

                <button>
                    {mode === "login" ? "No account? Sign up" : "Have an account? Log in"}
                </button>
            </form>
        </main>
    )
}