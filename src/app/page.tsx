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

  const filteredExpenses = expenses.filter((exp) => {
    const matchesCategory = filterCategory
      ? exp.category.toLowerCase().includes(filterCategory.toLowerCase())
      : true;
    const matchesDate = filterDate ? exp.date === filterDate : true;
    return matchesCategory && matchesDate;
  });

  const clearFilters = () => {
    setFilterCategory("");
    setFilterDate("");
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Expense Tracker</h1>
      <ExpenseForm onAdd={addExpense} />
      <ExpenseFilter
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        onClear={clearFilters}
      />
      {/* <ExpenseChart></ExpenseChart> */}
      <ExpenseList expenses={filteredExpenses} onDelete={deleteExpense} />
    </div>
  );
}
