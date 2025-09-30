"use client";

import { useMemo } from "react";
import type { Expense } from "@/src/app/types/expense";

export type FilterState = {
  q: string;                 // search query (title)
  category: string;          // exact match, "" = all
  from: string;              // yyyy-MM-dd or ""
  to: string;                // yyyy-MM-dd or ""
  min: string;               // number as string
  max: string;               // number as string
  sort: "date-desc" | "date-asc" | "amount-desc" | "amount-asc";
};

type Props = {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  expenses?: Expense[];
};

export default function FilterBar({ filters, setFilters, expenses }: Props) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    expenses?.forEach((e) => set.add(e.category));
    return ["", ...Array.from(set)];
  }, [expenses]);

  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    setFilters({ ...filters, [key]: value });

  return (
    <div className="mt-4 grid gap-3 md:grid-cols-5 grid-cols-2 items-end">
      <div className="col-span-2">
        <label className="block text-sm font-medium">Search</label>
        <input
          type="text"
          value={filters.q}
          onChange={(e) => update("q", e.target.value)}
          placeholder="Title..."
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Category</label>
        <select 
        value={filters.category}
        onChange={(e) => update("category", e.target.value)}
        className="w-full border rounded px-2 py-1">
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "" ? "All" : c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">From</label>
        <input
          type="date"
          value={filters.from}
          onChange={(e) => update("from", e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">To</label>
        <input
          type="date"
          value={filters.to}
          onChange={(e) => update("to", e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Min</label>
        <input
          type="number"
          value={filters.min}
          onChange={(e) => update("min", e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Max</label>
        <input
          type="number"
          value={filters.max}
          onChange={(e) => update("max", e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Sort</label>
        <select
          value={filters.sort}
          onChange={(e) =>
            update("sort", e.target.value as FilterState["sort"])
          }
          className="w-full border rounded px-2 py-1"
        >
          <option value="date-desc">Date ↓ (newest)</option>
          <option value="date-asc">Date ↑ (oldest)</option>
          <option value="amount-desc">Amount ↓</option>
          <option value="amount-asc">Amount ↑</option>
        </select>
      </div>
    </div>
  );
}
