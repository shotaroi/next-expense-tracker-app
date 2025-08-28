// import { ExpenseWhereInput, ExpenseOrderByWithRelationInput } from "@prisma/client";
import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const sort = searchParams.get("sort");

    // const where: Parameters<typeof prisma.expense.findMany>[0]["where"] = {};
    const where: Prisma.ExpenseWhereInput = {};

    if (category) {
      where.category = { contains: category, mode: "insensitive"};
    }

    if (fromDate || toDate) {
        where.date = {};
        if (fromDate) where.date.gte = new Date(fromDate);
        if (toDate) where.date.lte = new Date(toDate);
    }


    let orderBy: Prisma.ExpenseOrderByWithRelationInput = { date: "desc" };
    if (sort === "amount") {
      orderBy = { amount: "desc" };
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy,
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
    const { title, amount, category, date } = await req.json();
    const newExpense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
      },
    });
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
        {error: "Failed to create expense"},
        {status: 500}
    );
  }
}

export async function PUT(req: Request) {
    try {
        const {id, title, amount, category, date} = await req.json();

        const updatedExpense = await prisma.expense.update({
            where: {id},
            data: {
                title,
                amount: parseFloat(amount),
                category,
                date: new Date(date),
            },
        });

        return NextResponse.json(updatedExpense);
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Failed to update expense"}, {status: 500});
    }
}

export async function DELETE(req: Request) {
    try {
        const {id} = await req.json();

        await prisma.expense.delete({
            where: {id},
        });

        return NextResponse.json({message: "Expense deleted successfully"});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Failed to delete expense"}, {status: 500});
    }
}
