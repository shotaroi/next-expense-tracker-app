"use client";

import { useEffect, useState } from "react";
import { Expense } from "@/src/app/types/expense";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import Link from "next/link";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#a4de6c"];

export default function AnalyticsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data: Expense[] = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const totalsByCategory: Record<string, number> = expenses.reduce<
    Record<string, number>
  >((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const chartData = Object.entries(totalsByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const monthlyTotals = expenses.reduce<Record<string, number>>((acc, exp) => {
    const month = new Date(exp.date).toLocaleString("default", {month: "short", year: "numeric"});
    acc[month] = (acc[month] || 0) + exp.amount;
    return acc;
  }, {});

  const barData = Object.entries(monthlyTotals).map(([month, total]) => ({
    month,
    total,
  }));

  type CustomLableProps = {
    name?: string;
    percent?: number;
  }

  const CustomLabel = ({name, percent}: CustomLableProps) => {
    if (!name || percent === undefined) return null;
    return `${name} ${(percent * 100).toFixed(0)}%`
  };

  return (
    <main className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">📊 Expense Analytics</h1>
      <div className="p-3 space-y-10">
        <Link href={"/"} className="text-blue-600 hover:underline">
        ← Back to Expenses
        </Link>
        <p>Total Spent: ${total}</p>
      </div>

      <div className="flex justify-center">
        <h2>Spending by Category</h2>
        {chartData.length === 0 ? (
          <p>No expense yet</p>
        ) : (
          <PieChart width={400} height={300}>
            <Pie
            data={chartData}
            cx={200}
            cy={150}
            labelLine={false}
            label={CustomLabel}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            < Legend/>
          </PieChart>
        )}
      </div>

      <div className="">
        <BarChart width={500} height={300} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8"/>
        </BarChart>
      </div>
    </main>
  );
}
