"use client";

import {useEffect, useState} from "react";

type Expense = {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
};

export default function ExpensePage({params}: {params: {id: string}}) {
    const [expense, setExpense] = useState<Expense | null>(null);

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/expenses/${params.id}`);
            if (res.ok) setExpense(await res.json());
        })();
    }, [params.id]);

    if (!expense) return <main className="p-6"></main>;

    return (
        <main className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{expense.title}</h1>
            <p>{expense.category} • ${expense.amount} • {new Date(expense.date).toLocaleDateString()}</p>
        </main>
    )
}
