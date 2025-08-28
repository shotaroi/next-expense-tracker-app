"use client";

import { useState, useEffect } from "react";
import { v4 as uuid4 } from "uuid";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { Expense } from "./types/expense";
import ExpenseFilter from "./components/ExpenseFilter";

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "">("");
  const categories = ["Music", "Movie", "Animal"];

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await fetch("/api/expenses");
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    }
    fetchExpenses();
  }, []);

  useEffect(() => {
    localStorage.setItem("filters", 
      JSON.stringify({
        category: filterCategory,
        start: startDate,
        end: endDate,
        sort: sortBy,
      })
    );
  }, [filterCategory, startDate, endDate, sortBy]);

  const addExpense = async (
    title: string,
    amount: number,
    category: string,
    date: string
  ) => {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({title, amount, category, date}),
    });
    if (res.ok) {
      const newExpenses = await res.json();
      setExpenses([newExpenses, ...expenses]);
    }
  };

  const deleteExpense = async (id: string) => {
    const res = await fetch("/api/expenses/${id}", {method: "DELETE"});
    if (res.ok) {
      setExpenses(expenses.filter((exp) => exp.id !== id));
    }
  };

  const clearFilters = () => {
    setFilterCategory("");
    setStartDate("");
    setEndDate("");
    setSortBy("");
  }

  let displayedExpenses = [...expenses];

  if (filterCategory) {
    displayedExpenses = displayedExpenses.filter((exp) => exp.category.toLowerCase().includes(filterCategory.toLowerCase()));
  }

  // The "new object" is just a temporary Date instance created for the comparison. It only checks if they fall on the same day.
  if (startDate) {
    displayedExpenses = displayedExpenses.filter((exp) => new Date(exp.date) >= new Date(startDate));
  };

  if (endDate) {
    displayedExpenses = displayedExpenses.filter((exp) => new Date(exp.date) <= new Date(endDate));
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
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onClear={clearFilters}
      />
      <div className="">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "")}>
          <option value="">No Sort</option>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>
      <ExpenseList expenses={displayedExpenses} onDelete={deleteExpense} />
    </div>
  );
}
