"use client";

import { useEffect, useState } from "react";
import type { Expense } from "@/src/app/types/expense";
import { p } from "framer-motion/client";

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

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Expenses</h1>
      {expenses.length === 0 ? (
        <p>No expenses yet</p>
      ) : (
        <ul>
          {expenses.map((exp) => (
            <li key={exp.id}>
              {exp.title} - ${exp.amount} ({exp.category})
              {new Date(exp.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) 
      }
    </div>
  )


}