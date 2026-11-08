"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PermissionGuard from "@/components/PermissionGuard";

export default function ReconciliationPage() {
  const [sales, setSales] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [cashCounted, setCashCounted] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: salesData } = await supabase
      .from("sales")
      .select("total")
      .gte("created_at", today.toISOString());

    const { data: expenseData } = await supabase
      .from("expenses")
      .select("amount")
      .gte("created_at", today.toISOString());

    const totalSales =
      salesData?.reduce(
        (sum, item) => sum + item.total,
        0
      ) || 0;

    const totalExpenses =
      expenseData?.reduce(
        (sum, item) => sum + item.amount,
        0
      ) || 0;

    setSales(totalSales);
    setExpenses(totalExpenses);
  }

  const expectedCash =
    sales - expenses;

  const variance =
    cashCounted - expectedCash;

  return (
    <PermissionGuard permission="reconciliation">
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Cash Reconciliation
      </h1>

      <div className="grid grid-cols-3 gap-4">

        <div className="bg-green-100 p-4 rounded">
          <p>Sales</p>
          <h2 className="text-2xl font-bold">
            KES {sales}
          </h2>
        </div>

        <div className="bg-red-100 p-4 rounded">
          <p>Expenses</p>
          <h2 className="text-2xl font-bold">
            KES {expenses}
          </h2>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <p>Expected Cash</p>
          <h2 className="text-2xl font-bold">
            KES {expectedCash}
          </h2>
        </div>

      </div>

      <div className="mt-8 max-w-md">

        <label className="block mb-2">
          Actual Cash Counted
        </label>

        <input
          type="number"
          value={cashCounted}
          onChange={(e) =>
            setCashCounted(
              Number(e.target.value)
            )
          }
          className="border p-2 w-full rounded"
        />

      </div>

      <div className="mt-6">

        <h2 className="text-xl font-bold">

          Variance:

          <span
            className={
              variance === 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {" "}
            KES {variance}
          </span>

        </h2>

      </div>

    </div>
    </PermissionGuard>
  );
}