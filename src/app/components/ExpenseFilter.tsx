interface ExpenseFilterProps {
    categories: string[];
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onClear: () => void;
}

export default function ExpenseFilter({
    categories,
  filterCategory,
  setFilterCategory,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
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
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border rounded px-2 py-1 w-1/2"
      />
      <span className="self-center">to</span>
      <input type="date" 
      value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
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
