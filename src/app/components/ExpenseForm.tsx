"use client";

import { useState, useEffect } from "react";
import type { Expense } from "@/src/app/types/expense";

type ExpenseFormProps = {
  onCreate: (expense: Omit<Expense, "id">) => void | Promise<void>;
  onUpdate: (expense: Expense) => void | Promise<void>;
  editingExpense?: Expense;
};

export default function ExpenseForm({
  onCreate,
  onUpdate,
  editingExpense,
}: ExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);

      const formattedDate = new Date(editingExpense.date)
      .toISOString()
      .split("T")[0];
      console.log(formattedDate);
      setDate(formattedDate);
    } else {
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
    }
  }, [editingExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !category || !date) return;

    if (editingExpense) {
      onUpdate({
        ...editingExpense,
        title,
        amount: parseFloat(amount),
        category,
        date,
      });
    } else {
      onCreate({
        title,
        amount: parseFloat(amount),
        category,
        date,
      });
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded space-y-3 p-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button
        type="submit"
        className="rounded bg-blue-500 hover:bg-blue-600 px-2 py-1"
      >
        {editingExpense ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
}
