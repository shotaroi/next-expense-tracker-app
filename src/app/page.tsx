"use client";

import { useEffect, useState } from "react";
// import type { Expense } from "@/src/app/types/expense";
import { Expense } from "@prisma/client";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpense = async () => {
    try {
      const res = await fetch("/api/expenses");
      if (!res.ok) throw new Error("Failed to fetch expenses");

      const data: Expense[] = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Expenses</h1>
      {expenses.length === 0 ? (
        <p>No expenses yet</p>
      ) : (
        <ul className="space-y-2">
          {expenses.map((exp) => (
            <li key={exp.id} className="flex justify-between items-center border p-2 rounded">
              <span>
                {exp.title} - {exp.category}
              </span>
              <span>
                ${exp.amount} on {new Date(exp.date).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
