import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const expense = await prisma.expense.findUnique({ where: { id: params.id } });
  return NextResponse.json(expense);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { title, amount, category, date } = await req.json();
  const expense = await prisma.expense.update({
    where: { id: params.id },
    data: { title, amount: parseFloat(amount), category, date: new Date(date) },
  });
  return NextResponse.json(expense);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.expense.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted sucessfully" });
}
