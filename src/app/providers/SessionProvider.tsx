// Add a client SessionProvider wrapper
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export default function SessionProvider({
    children,
    session,
}: {
    children: React.ReactNode;
    session: Session | null;
}) {
    return <NextAuthSessionProvider session={session}>{children}</NextAuthSessionProvider>;
}