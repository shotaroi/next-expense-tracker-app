// import { ExpenseWhereInput, ExpenseOrderByWithRelationInput } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    // Get the current logged-in user
    // getServerSession() reads the NextAuth session (JWT or database) directly on the server.
    // authOptions is our NextAuth configuration, so it knows how to decode the session and verify it.
    const session = await getServerSession(authOptions);

    // apply any existing query filters added earlier, but always AND userId
    const url = new URL(req.url);
    const category = url.searchParams.get("category");

    const expenses = await prisma.expense.findMany({
      where: {
        userId: session?.user.id,
        ...(category ? { category } : {}),
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, amount, category, date } = await req.json();

    if (!title || !amount || !category || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newExpense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        userId: session.user.id, // tie to owner
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
