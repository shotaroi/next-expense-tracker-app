"use client";

import { useEffect, useState } from "react";
// import type { Expense } from "@/src/app/types/expense";
import { Expense } from "@prisma/client";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newExpense = { title, amount: parseFloat(amount), category, date };

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(newExpense),
      });

      if (!res.ok) throw new Error("Failed to create expense");

      const saved: Expense = await res.json();

      setExpenses((prev) => [...prev, saved]);

      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");

    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Expenses</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2" >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="number"
          step={0.01}
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button type="submit" className="bg-blue-500 px-2 py-1 rounded">
          Add Expense
        </button>

      </form>

      {expenses.length === 0 ? (
        <p>No expenses yet</p>
      ) : (
        <ul className="space-y-2">
          {expenses.map((exp) => (
            <li
              key={exp.id}
              className="flex justify-between items-center border p-2 rounded"
            >
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
