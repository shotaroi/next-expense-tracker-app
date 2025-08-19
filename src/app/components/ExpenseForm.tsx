import { useState } from "react";

interface ExpenseFormProps {
  onAdd: (
    title: string,
    amount: number,
    category: string,
    date: string
  ) => void;
}

export default function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || !category || !date) return;

    onAdd(title, parseFloat(amount), category, date);

    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:gap-4 mb-4"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border rounded px-2 py-1"
      />

      <button type="submit"
      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded col-span-full sm:col-span-1">Add</button>
    </form>
  );
}
