"use client";

import { useState, useEffect } from "react";
import { v4 as uuid4 } from "uuid";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseChart from "./components/ExpenseChart";
import ExpenseList from "./components/ExpenseList";
import { Expense } from "./types/expense";
import ExpenseFilter from "./components/ExpenseFilter";

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "">("");
  const categories = ["Music", "Movie", "Animal"];

  useEffect(() => {
    const stored = localStorage.getItem("expenses");
    if (stored) setExpenses(JSON.parse(stored));
  }, []);

  const addExpense = (
    title: string,
    amount: number,
    category: string,
    date: string
  ) => {
    const newExpense: Expense = { id: uuid4(), title, amount, category, date };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter((exp) => exp.id !== id);
    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
  };

  const clearFilters = () => {
    setFilterCategory("");
    setFilterDate("");
  }

  let displayedExpenses = [...expenses];

  if (filterCategory) {
    displayedExpenses = displayedExpenses.filter((exp) => exp.category.toLowerCase().includes(filterCategory.toLowerCase()));
  }

  // The "new object" is just a temporary Date instance created for the comparison. It only checks if they fall on the same day.
  if (filterDate) {
    displayedExpenses = displayedExpenses.filter((exp) => new Date(exp.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString());
  }

  if (sortBy === "date") {
    displayedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  if (sortBy === "amount") {
    displayedExpenses.sort((a, b) => b.amount - a.amount);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Expense Tracker</h1>
      <ExpenseForm onAdd={addExpense} categories={categories}/>
      <ExpenseFilter
      categories={categories}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        onClear={clearFilters}
      />
      <div className="">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "")}>
          <option value="">No Sort</option>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>
      {/* <ExpenseChart></ExpenseChart> */}
      <ExpenseList expenses={displayedExpenses} onDelete={deleteExpense} />
    </div>
  );
}
