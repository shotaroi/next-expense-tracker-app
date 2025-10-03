// Helper from Next.js App Router to send JSON/HTTP responses.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// library to hash passwords securly
import bcrypt from "bcrypt";

// Signup API (to create users)
export async function POST(req: Request) {
    try {
        const {email, password, name } = await req.json();
        if (!email || !password) {
            return NextResponse.json({error: "Email and password required"}, {status: 400});
        }
        const existing = await prisma.user.findUnique({where: {email}});
        if (existing) return NextResponse.json({error: "Email already in use"}, {status: 409});

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({data: {email, name, passwordHash}});
        return NextResponse.json({id: user.id, email: user.email});
    } catch (e) {
        console.log(e);
        return NextResponse.json({error: "Failed to sign up"}, {status: 500});
    }
}