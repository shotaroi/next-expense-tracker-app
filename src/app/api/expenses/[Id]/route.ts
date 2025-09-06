import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

type Params = {
  params: { id: string };
};

export async function DELETE(_req: Request, context: Params) {
//   console.log("DELETE route hit");
//   console.log("DELETE context: ", context);

  const {id} = await context.params;
  try {
    await prisma.expense.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted sucessfully" });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(_req: Request, context: {params: Promise<{id: string}>}) {
    const {id} = await context.params;
    console.log("GET request for expense id:", id)

  try {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });
    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json(expense);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(_req: Request, context: {params: Promise<{id: string}>}) {
    const {id} = await context.params;
    console.log("PATCH request for id: ", id);

    try {
        const data = await _req.json();
        const {title, amount, category, date} = data;
        const updatedExpense = await prisma.expense.update({
            where: {id},
            data: {
                title, 
                amount: Number(amount),
                category,
                date: date ? new Date(date) : undefined,
            },
        });
        console.log("Expense updated: ", updatedExpense);
        return NextResponse.json(updatedExpense);
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P205"
        ) {
            return NextResponse.json({error: "Expense not found"}, {status: 404});
        }
        console.error("PATCH error: ", error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}
