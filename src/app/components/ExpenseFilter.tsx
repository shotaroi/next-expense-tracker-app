import { option } from "framer-motion/client";

interface ExpenseFilterProps {
    categories: string[];
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  filterDate: string;
  setFilterDate: (val: string) => void;
  onClear: () => void;
}

export default function ExpenseFilter({
    categories,
  filterCategory,
  setFilterCategory,
  filterDate,
  setFilterDate,
  onClear,
}: ExpenseFilterProps) {
  return (
    <div className="flex gap-2 space-y-2 border-t pt-4 items-center">
      <select value={filterCategory}
      onChange={(e) => setFilterCategory(e.target.value)}
      className="border rounded px-2 py-1">
        <option value="">All Categories</option>
        {categories.map((cat) => (
            <option key={cat}>{cat}</option>
        ))}
      </select>
      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="border rounded px-2 py-1 w-1/2"
      />
      <button
      onClick={onClear}
      className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
      >
        Clear
      </button>
    </div>
  );
}
