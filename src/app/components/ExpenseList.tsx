import { Expense } from "../types/expense";

interface ExpenseListProps {
    expenses: Expense[];
    onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    if (expenses.length === 0) {
        return <p className="text-gray-500">No expenses found</p>
    }

    return (
        <div className="space-y-3">
            {expenses.map((exp) => (
                <div key={exp.id} className="">
                    <div>
                        <h3>{exp.title}</h3>
                        <p>{exp.category} - {new Date(exp.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-semibold">
                            ${exp.amount.toFixed(2)}
                        </span>
                        <button onClick={() => onDelete(exp.id)}
                            className="bg-red-500 hover:bg-red-600 rounded text-white px-2 py-1">
                            Delete
                        </button>
                    </div>
                </div>
            ))}
            {expenses.length > 0 && (
                <div className="text-right font-bold mt-4">
                    Total: ${total.toFixed(2)}
                </div>
            )}
        </div>
    )
}