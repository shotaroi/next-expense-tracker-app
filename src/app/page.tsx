"use client";

import { useEffect, useState } from "react";
import ExpenseForm from "@/src/app/components/ExpenseForm";
import type { Expense } from "@/src/app/types/expense";
import { li } from "framer-motion/client";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchExpense = async () => {
    try {
      const res = await fetch("/api/expenses");
      if (!res.ok) throw new Error("Failed to fetch expenses");

      const data: Expense[] = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, []);

  const handleCreate = async (expense: Omit<Expense, "id">) => {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });

    if (res.ok) {
      await fetchExpense();
    }
  };

  const handleDelete = async (id: string) => {
    console.log(id);
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });

    if (res.ok) {
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } else {
      const error = await res.json();
      console.error("Delete failed", error);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>
      <ExpenseForm></ExpenseForm>

      <ul space-y-4 mt-6>
        {expenses.map((exp) => (
          <li key={exp.id} className="flex justify-between items-center p-2 border rounded">
            <div>
              <p className="font-semibold">{exp.title}</p>
              <p className="text-sm text-gray-600">
                {exp.category} • {exp.amount} •{" "}
                {new Date(exp.date).toLocaleDateString()}
              </p>
            </div>
            <button className="text-red-500 hover:underline">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
