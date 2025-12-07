import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

// If credentials + Prisma are used, keep auth on Node runtime
export const runtime = "nodejs";

// GET/api/expenses/[id]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> } // inline type, Promise to allow awaiting
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expense = await prisma.expense.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!expense) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(expense);
}

// PATCH/api/expenses/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure the record belongs to the user.
  const existing = await prisma.expense.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await prisma.expense.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      amount: body.amount !== undefined ? Number(body.amount) : existing.amount,
      category: body.category ?? existing.category,
      date: body.date ? new Date(body.date) : existing.date,
    },
  });

  return NextResponse.json(updated);
}

// DELETE/api/expenses/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure ownership, then delete
  const existing = await prisma.expense.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.expense.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
