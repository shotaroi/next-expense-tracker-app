"use client";

import { useEffect, useState } from "react";
import ExpenseForm from "@/src/app/components/ExpenseForm";
import type { Expense } from "@/src/app/types/expense";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editing, setEditing] = useState<Expense | null>(null);

  const fetchExpenses = async () => {
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
    fetchExpenses();
  }, []);

  const handleCreate = async (expense: Omit<Expense, "id">) => {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });

    if (res.ok) {
      await fetchExpenses();
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

  const handleUpdate = async (expense: Expense) => {
    const res = await fetch(`/api/expenses/${expense.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
    if (res.ok) {
      await fetchExpenses();
      setEditing(null);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>
      <ExpenseForm
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        editingExpense={editing || undefined}
      ></ExpenseForm>

      <ul className="space-y-4 mt-6">
        {expenses.map((exp) => (
          <li
            key={exp.id}
            className="flex justify-between items-center p-2 border rounded"
          >
            <div>
              <p className="font-semibold">{exp.title}</p>
              <p className="text-sm text-gray-600">
                {exp.category} • ${exp.amount} •{" "}
                {new Date(exp.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(exp)} className="text-blue-500 hover:underline">
                Edit
              </button>
            <button
              onClick={() => handleDelete(exp.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
            </div>

            
          </li>
        ))}
      </ul>
    </main>
  );
}
