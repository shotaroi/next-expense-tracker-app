"use client";

import { useState } from "react";

interface ExpenseFormProps {
  expenseId?: string;
  initialTitle?: string;
  initialAmount?: number;
  initialCategory?: string;
  initialDate?: string;
  onSuccess?: () => void;
}

export default function ExpenseForm({
  expenseId,
  initialTitle = "",
  initialAmount = 0,
  initialCategory = "",
  initialDate = "",
  onSuccess,
}: ExpenseFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [amount, setAmount] = useState(initialAmount);
  const [category, setCategory] = useState(initialCategory);
  const [date, setDate] = useState(initialDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { title, amount, category, date };

    try {
      if (expenseId) {
        await fetch("/api/expenses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, id: expenseId }),
        });
      } else {
        await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (onSuccess) onSuccess();
      setTitle("");
      setAmount(0);
      setCategory("");
      setDate("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4" >
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="px-2 py-1 border rounded w-full" />
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="px-2 py-1 border rounded w-full" />
      <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="px-2 py-1 border rounded w-full" />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-2 py-1 border rounded w-full" />
      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" >
        {expenseId ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  )
}
