interface ExpenseFilterProps {
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  filterDate: string;
  setFilterDate: (val: string) => void;
  onClear: () => void;
}

export default function ExpenseFilter({
  filterCategory,
  setFilterCategory,
  filterDate,
  setFilterDate,
  onClear,
}: ExpenseFilterProps) {
  return (
    <div className="space-y-2 border-t pt-4 mt-4">
      <h2 className="font-bold">Filter Expenses</h2>
      <input
        type="text"
        placeholder="Filter by category"
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="w-1/2 border rounded px-2 py-1"
      />
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
