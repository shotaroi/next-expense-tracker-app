"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function HeaderAuth() {
    const {data: session, status} = useSession();

    if (status === "loading") {
        return <div className="h-5 w-28 animate-pulse bg-gray-200 rounded">Loading...</div>;
    }

    if (!session?.user) {
        return (
            <Link href={"/login"} className="text-blue-600 hover:underline">Login</Link>
        );
    }

    const display = session.user.name || session.user.email || "User";

    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-700">Hi, {display}</span>
            <button onClick={() => signOut({callbackUrl: "/login"})} className="text-blue-600 hover:underline">Logout</button>
        </div>
    );
}