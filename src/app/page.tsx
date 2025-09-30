"use client";

import { useEffect, useState, useMemo } from "react";
import ExpenseForm from "@/src/app/components/ExpenseForm";
import type { Expense } from "@/src/app/types/expense";
import Link from "next/link";
import FilterBar, {FilterState} from "./components/FilterBar";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editing, setEditing] = useState<Expense | null>(null);
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const [filters, setFilters] = useState<FilterState>({
    q: "",
    category: "",
    from: "",
    to: "",
    min: "",
    max: "",
    sort: "date-desc",
  });

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

  // Helper: normalize date-only compare (local midnight)
  const toMidnight = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  };

  const filtered = useMemo(() => {
    const  q = filters.q.trim().toLowerCase();
    const fromTs = filters.from ? toMidnight(new Date(filters.from)) : null;
    const toTs = filters.to ? toMidnight(new Date(filters.to)) : null;
    const min = filters.min ? parseFloat(filters.min) : null;
    const max = filters.max ? parseFloat(filters.max) : null;

    const out = expenses.filter((e) => {
      const titleOk = q ? e.title.toLowerCase().includes(q) : true;
      const catOk = filters.category ? e.category === filters.category : true;

      const dayTs = toMidnight(new Date(e.date));
      const fromOk = fromTs !== null ? dayTs >= fromTs : true;
      const toOk = toTs !== null ? dayTs <= toTs : true;

      const minOk = min !== null ? e.amount >= min : true;
      const maxOk = max !== null ? e.amount <= max : true;

      return titleOk && catOk && fromOk && toOk && minOk && maxOk;
    });

    out.sort((a, b) => {
      switch (filters.sort) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "amount-asc":
          return a.amount - b.amount;
        case "amount-desc":
          return b.amount - a.amount;
      }
    });

    return out;
  }, [expenses, filters]);



  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>

      <nav className="mt-4">
        <Link href={"/analytics"} className="text-blue-600 hover:underline">
          📊 View Analytics
        </Link>
      </nav>

      <ExpenseForm
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        editingExpense={editing || undefined}
      ></ExpenseForm>

      <FilterBar filters={filters} setFilters={setFilters} expenses={expenses} />

      <div className="border rounded mt-6 p-4 bg-gray-50">
        <p className="font-semibold text-lg text-amber-400">Total Spent: ${total}</p>
      </div>

      {/* Expenses List */}
      <ul className="space-y-4 mt-6">
        {filtered.map((exp) => (
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
              <button
                onClick={() => setEditing(exp)}
                className="text-blue-500 hover:underline"
              >
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
