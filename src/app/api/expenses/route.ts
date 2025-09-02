// import { ExpenseWhereInput, ExpenseOrderByWithRelationInput } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
   const expenses = await prisma.expense.findMany({
    orderBy: {date: "desc"}
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


