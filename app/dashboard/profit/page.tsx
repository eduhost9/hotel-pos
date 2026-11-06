"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfitPage() {
  const [revenue, setRevenue] =
    useState(0);

  const [expenses, setExpenses] =
    useState(0);

  const [profit, setProfit] =
    useState(0);

    const [period, setPeriod] =
  useState("today");

  useEffect(() => {
    loadFinancials();
  }, [period]);

  async function loadFinancials() {

    let startDate = new Date();

if (period === "today") {

  startDate.setHours(
    0,
    0,
    0,
    0
  );

} else if (
  period === "week"
) {

  startDate.setDate(
    startDate.getDate() - 7
  );

} else if (
  period === "month"
) {

  startDate.setMonth(
    startDate.getMonth() - 1
  );

}

    const { data: sales } =
      await supabase
        .from("sales")
.select("total")
.gte(
  "created_at",
  startDate.toISOString()
);

    const { data: expenseData } =
      await supabase
        .from("expenses")
.select("amount")
.gte(
  "created_at",
  startDate.toISOString()
);

    const revenueTotal =
      (sales || []).reduce(
        (sum, sale) =>
          sum + Number(sale.total),
        0
      );

    const expenseTotal =
      (expenseData || []).reduce(
        (sum, expense) =>
          sum +
          Number(expense.amount),
        0
      );

    setRevenue(revenueTotal);

    setExpenses(expenseTotal);

    setProfit(
      revenueTotal - expenseTotal
    );
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Profit Dashboard
      </h1>
    <div className="flex gap-3 mb-6">

  <button
    onClick={() =>
      setPeriod("today")
    }
    className={`px-4 py-2 rounded ${
      period === "today"
        ? "bg-blue-600 text-white"
        : "bg-gray-200"
    }`}
  >
    Today
  </button>

  <button
    onClick={() =>
      setPeriod("week")
    }
    className={`px-4 py-2 rounded ${
      period === "week"
        ? "bg-blue-600 text-white"
        : "bg-gray-200"
    }`}
  >
    This Week
  </button>

  <button
    onClick={() =>
      setPeriod("month")
    }
    className={`px-4 py-2 rounded ${
      period === "month"
        ? "bg-blue-600 text-white"
        : "bg-gray-200"
    }`}
  >
    This Month
  </button>

</div>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white border rounded-xl p-6">

          <h2 className="text-gray-500">
            Revenue
          </h2>

          <div className="text-4xl font-bold">
            KES {revenue}
          </div>

        </div>

        <div className="bg-white border rounded-xl p-6">

          <h2 className="text-gray-500">
            Expenses
          </h2>

          <div className="text-4xl font-bold">
            KES {expenses}
          </div>

        </div>

        <div className="bg-white border rounded-xl p-6">

          <h2 className="text-gray-500">
            Profit
          </h2>

          <div
            className={`text-4xl font-bold ${
              profit >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            KES {profit}
          </div>

        </div>

      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">

  <h2 className="text-xl font-bold mb-4">
    Profit Formula
  </h2>

  <div className="space-y-2">

    <div>
      Revenue:
      {" "}
      KES {revenue}
    </div>

    <div>
      Expenses:
      {" "}
      KES {expenses}
    </div>

    <div className="font-bold">

      Net Profit:

      {" "}

      KES {profit}

    </div>

  </div>

</div>

    </div>
  );
}