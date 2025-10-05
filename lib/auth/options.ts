import type {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"},
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const user = await prisma.user.findUnique({
                    where: {email: credentials.email},
                });
                if (!user) return null;
                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) return null;
                
                return {id: user.id, name: user.name, email: user.email};
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) token.userId = user.id;
            return token;
        },
        async session({session, token}) {
            if (session.user && token.userId) session.user.id = token.userId as string;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};