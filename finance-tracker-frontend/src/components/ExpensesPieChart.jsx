// src/pages/Dashboard.jsx
import React from "react";
import ExpensesPieChart from "../components/ExpensesPieChart";

export default function Dashboard() {
  // ---------- SAMPLE DATA: replace with your real data ----------
  const transactions = [
    {
      id: 1,
      date: "2025-12-11",
      type: "income",
      description: "qwe",
      amount: 21312134,
      category: "Salary",
    },
    {
      id: 2,
      date: "2025-12-09",
      type: "expense",
      description: "hghg",
      amount: 145627,
      category: "Shopping",
    },
    {
      id: 3,
      date: "2025-12-04",
      type: "expense",
      description: "meow34",
      amount: 1231233,
      category: "Investments",
    },
    {
      id: 4,
      date: "2025-12-03",
      type: "expense",
      description: "meow",
      amount: 12314,
      category: "Food",
    },
  ];
  // -------------------------------------------------------------

  // Totals from the same list
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Build category totals for the pie chart
  function buildExpenseByCategory(list) {
    const map = new Map();

    list.forEach((tx) => {
      if (tx.type !== "expense") return;
      const key = tx.category || "Uncategorized";
      const prev = map.get(key) || 0;
      map.set(key, prev + tx.amount);
    });

    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }

  const expenseByCategory = buildExpenseByCategory(transactions);

  return (
    <div className="space-y-10">
      {/* Page title */}
      <h1 className="luxia-heading text-3xl mb-2">Dashboard</h1>

      {/* Date filter + totals */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        {/* Date filter strip */}
        <div className="inline-flex items-center gap-4 px-7 py-3 rounded-3xl border border-slate-600 bg-slate-900/70 backdrop-blur-md shadow-[0_0_28px_rgba(15,23,42,0.9)]">
          <span className="luxia-heading text-[0.8rem] tracking-[0.24em] uppercase text-slate-300">
            Date Filter
          </span>

          <button className="inline-flex items-center justify-center px-5 py-1.5 rounded-full border text-[0.7rem] tracking-[0.16em] uppercase transition transform border-emerald-400 bg-emerald-500 text-slate-900 shadow-[0_0_18px_rgba(16,185,129,0.8)] -translate-y-[1px]">
            This Month
          </button>
          <button className="inline-flex items-center justify-center px-5 py-1.5 rounded-full border text-[0.7rem] tracking-[0.16em] uppercase transition transform border-slate-500 bg-slate-900/70 text-slate-100 hover:border-emerald-400 hover:bg-emerald-500/90 hover:text-slate-900 hover:shadow-[0_0_16px_rgba(16,185,129,0.7)] hover:-translate-y-[1px]">
            Last Month
          </button>
          <button className="inline-flex items-center justify-center px-5 py-1.5 rounded-full border text-[0.7rem] tracking-[0.16em] uppercase transition transform border-slate-500 bg-slate-900/70 text-slate-100 hover:border-emerald-400 hover:bg-emerald-500/90 hover:text-slate-900 hover:shadow-[0_0_16px_rgba(16,185,129,0.7)] hover:-translate-y-[1px]">
            Custom
          </button>
        </div>

        {/* Totals row */}
        <div className="text-xs sm:text-sm space-y-1 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row">
          <span>
            <span className="luxia-heading tracking-[0.16em] uppercase text-slate-400 mr-2">
              Total Income
            </span>
            <span className="font-semibold text-emerald-300">
              ₹{totalIncome.toLocaleString()}
            </span>
          </span>

          <span>
            <span className="luxia-heading tracking-[0.16em] uppercase text-slate-400 mr-2">
              Total Expenses
            </span>
            <span className="font-semibold text-rose-300">
              ₹{totalExpenses.toLocaleString()}
            </span>
          </span>

          <span>
            <span className="luxia-heading tracking-[0.16em] uppercase text-slate-400 mr-2">
              Balance
            </span>
            <span className="font-semibold text-sky-300">
              ₹{balance.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      {/* Transactions + pie chart side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Recent Transactions */}
        <section>
          <h2 className="luxia-heading text-xl mb-4">Recent Transactions</h2>

          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between gap-4 border-b border-slate-700/70 pb-2 last:border-b-0"
              >
                {/* date + type */}
                <div className="min-w-[7rem]">
                  <p className="text-xs text-slate-400">{tx.date}</p>
                  <p
                    className={
                      "text-[0.65rem] tracking-[0.16em] uppercase " +
                      (tx.type === "income" ? "text-emerald-300" : "text-amber-300")
                    }
                  >
                    {tx.type}
                  </p>
                </div>

                {/* description + category */}
                <div className="flex-1">
                  <p className="text-sm text-slate-100">{tx.description}</p>
                  <p className="text-[0.7rem] text-slate-500 mt-0.5">
                    Category: {tx.category}
                  </p>
                </div>

                {/* amount */}
                <div className="text-right min-w-[6rem]">
                  <p
                    className={
                      "text-sm font-semibold " +
                      (tx.type === "income" ? "text-emerald-300" : "text-amber-300")
                    }
                  >
                    ₹{tx.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Expenses by Category – uses grouped data from transactions */}
        <section className="flex flex-col items-center lg:items-stretch">
          <h2 className="luxia-heading text-xl mb-4 text-center lg:text-left">
            Expenses by Category
          </h2>
          <div className="w-full max-w-lg mx-auto rounded-3xl border border-slate-700/70 bg-slate-900/70 p-4 shadow-[0_0_24px_rgba(15,23,42,0.9)]">
            <ExpensesPieChart data={expenseByCategory} />
          </div>
        </section>
      </div>
    </div>
  );
}
