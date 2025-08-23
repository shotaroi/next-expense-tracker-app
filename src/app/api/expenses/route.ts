import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const expenses = await prisma.expense.findMany({
        orderBy: { date: "desc"},
    });
    return NextResponse.json(expenses);
}

export async function POST(req: Request) {
    const { title, amount, category, date} = await req.json();
    const expense = await prisma.expense.create({
        data: { title, amount: parseFloat(amount), category, date: new Date(date) },
    });
    return NextResponse.json(expense);
}