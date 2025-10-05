// src/app/expenses/[id]/page.tsx
export default function ExpensePage({ params }: { params: { id: string } }) {
  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Expense {params.id}</h1>
    </main>
  );
}
