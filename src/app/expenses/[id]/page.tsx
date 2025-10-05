// src/app/expenses/[id]/page.tsx
export default async function ExpensePage({ params }: { params: { id: string } }) {
    const {id} = await params;

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Expense {id}</h1>
    </main>
  );
}
