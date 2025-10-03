// the core library
import NextAuth, { type NextAuthOptions} from "next-auth";
// lets users log in with email/password instead of Google/GitHub/etc.
import Credentials from "next-auth/providers/credentials";
// makes nextauth store uses/sessions/accounts in your prisma-managed database.
import { PrismaAdapter } from "@auth/prisma-adapter";
// Your Prisma client instance
import { prisma } from "@/lib/prisma";
// used to securely compare hashed passwords.
import bcrypt from "bcrypt";
// import type {JWT} from "next-auth/jwt";
// import type { AdapterUser } from "next-auth/adapters";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as const }, // simpler for App Router
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email,
          image: user.image ?? undefined,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login", // our custom page
  },
  callbacks: {
    async jwt({token, user,}) {
        if (user) token.userId = user.id; // typed via module augmentation
        return token;
    },
    async session ({session, token}) {
        if (session.user && token.userId) {
            session.user.id = token.userId; // typed via augmentation
        } 
        return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions;

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};
