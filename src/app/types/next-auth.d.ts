import type { DefaultSession } from "next-auth";

// Augment Session
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}

// Augment JWT
declare module "next-auth/jwt" {
    interface JWT {
        userId: string;
    }
}