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
  const [isSubmitting, setIsSubmiting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);

      const formattedDate = new Date(editingExpense.date)
        .toISOString()
        .split("T")[0];
      setDate(formattedDate);
    } else {
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
    }
  }, [editingExpense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !category || !date) {
      setMessage("❌ Please fill in all fields.");
      return;
    } 

    if (parseFloat(amount) <= 0) {
      setMessage("❌ Amount must be greater than 0.");
      return;
    }

    const today = new Date();
    today.setHours(0,0,0,0);
    const picked = new Date(date);
    picked.setHours(0,0,0,0);

    if (picked > today) {
      setMessage("❌ Date cannot be in the future.");
      return;
    }

    setIsSubmiting(true);
    try {
      if (editingExpense) {
        await onUpdate({
          ...editingExpense,
          title,
          amount: parseFloat(amount), 
          category,
          date,
        });
        setMessage("✅ Expense updated!");
      } else {
        await onCreate({
          title,
          amount: parseFloat(amount),
          category,
          date,
        });
        setMessage("✅ Expense added!");
        setTitle("");
        setAmount("");
        setCategory("");
        setDate("");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong.");
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}
      className="border rounded-lg p-4 space-y-3 shadow-sm bg-white "
    >
      <div className="space-y-1">
        <label className="block text-sm font-medium" >Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
        className="border rounded w-full px-2 py-1"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="border rounded w-full px-2 py-1" />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Category</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded w-full px-2 py-1" />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded w-full px-2 py-1" />
      </div>

      <button type="submit" disabled={isSubmitting} className="rounded bg-blue-500 hover:bg-blue-600 px-3 py-1 text-white disabled:opacity-50"  >
        {isSubmitting 
        ? "Saving..."
        : editingExpense
        ? "Update Expense"
        : "Add Expense"
      }
      </button>

      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>


  )
}
