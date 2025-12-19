// src/pages/Dashboard.jsx
import React from "react";

export default function Dashboard() {
  // Demo numbers – replace with real data later
  const totalIncome = 21312134;
  const totalExpenses = 1389174;
  const balance = totalIncome - totalExpenses;

  // Demo transactions – replace with your real list
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

  return (
    <div className="space-y-10">
      {/* Page title */}
      <h1 className="luxia-heading text-3xl mb-2">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 px-4 py-3">
          <p className="luxia-heading text-[0.75rem] tracking-[0.18em] uppercase text-emerald-300">
            Total Income
          </p>
          <p className="mt-1 text-xl font-semibold text-emerald-200">
            ₹{totalIncome.toLocaleString()}
          </p>
        </div>

        {/* Total Expenses */}
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/5 px-4 py-3">
          <p className="luxia-heading text-[0.75rem] tracking-[0.18em] uppercase text-rose-300">
            Total Expenses
          </p>
          <p className="mt-1 text-xl font-semibold text-rose-200">
            ₹{totalExpenses.toLocaleString()}
          </p>
        </div>

        {/* Balance */}
        <div className="rounded-2xl border border-sky-500/40 bg-sky-500/5 px-4 py-3">
          <p className="luxia-heading text-[0.75rem] tracking-[0.18em] uppercase text-sky-300">
            Balance
          </p>
          <p className="mt-1 text-xl font-semibold text-sky-200">
            ₹{balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent Transactions list */}
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
    </div>
  );
}
