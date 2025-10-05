// 👇 Shadow any global PageProps with the correct shape *for pages*
type PageProps = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function ExpensePage({params}: PageProps) {
    return (
        <main className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Expense {params.id}</h1>
        </main>
    )
}
