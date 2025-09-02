import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {Prisma} from "@prisma/client"

type Params = {
  params: { id: string };
};

export async function DELETE(_req: Request, { params }: Params) {
    console.log("DELETE route hit");
console.log("Received id in backend:", params.id);

  try {
    await prisma.expense.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Deleted sucessfully" });
  } catch (error) {
    if (
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025"
    ) {
        return NextResponse.json({error: "Expense not found"}, {status: 404});
    }

    return NextResponse.json({error: "Something went wrong"}, {status: 500});
  }
}

export async function GET(_req: Request, {params}: Params) {
    try {
        const expense = await prisma.expense.findUnique({
            where: {id: params.id},
        });
        if (!expense) {
            return NextResponse.json({error: "Expense not found"}, {status: 404});
        }
        return NextResponse.json(expense);
    } catch (error) {
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}
