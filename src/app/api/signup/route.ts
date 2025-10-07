export const runtime = "node.js";  // ensure node, not edge
// Helper from Next.js App Router to send JSON/HTTP responses.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// library to hash passwords securly
import bcrypt from "bcryptjs";

// Signup API (to create users)
export async function POST(req: Request) {
    try {
        const {email, password, name } = await req.json();

        if (!email || !password) {
            return NextResponse.json({error: "Email and password required"}, {status: 400});
        }

        if (password.length < 6) {
            return NextResponse.json({error: "Password must be at least 6 characters"}, {status: 400});
        }

        const existing = await prisma.user.findUnique({where: {email}});
        if (existing) return NextResponse.json({error: "Email already in use"}, {status: 409});

        const passwordHash = bcrypt.hashSync(password, 10);

        await prisma.user.create({data: {email, name, passwordHash}});

        return NextResponse.json({ok: true}, {status: 201});
    } catch (e) {
        console.error("Signup erro:", e);
        return NextResponse.json({error: "Failed to sign up"}, {status: 500});
    };
}