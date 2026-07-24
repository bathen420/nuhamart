export default function CheckoutLayout({ left, right }) {
    return (
        <main className="min-h-screen bg-slate-100 py-10">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
                <section className="lg:col-span-2">
                    {left}
                </section>

                <aside className="lg:col-span-1">
                    {right}
                </aside>
            </div>
        </main>
    );
}