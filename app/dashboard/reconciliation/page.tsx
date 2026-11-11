"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PermissionGuard from "@/components/PermissionGuard";

export default function ReconciliationPage() {

  const [sales, setSales] =
    useState<any[]>([]);

  const [expenses, setExpenses] =
    useState<any[]>([]);

  const [countedCash,
    setCountedCash] =
    useState("");

  const [notes,
    setNotes] =
    useState("");

  const [history,
    setHistory] =
    useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    const {
      data: salesData,
    } = await supabase
      .from("sales")
      .select("*")
      .gte(
        "created_at",
        today
      );

    const {
      data: expenseData,
    } = await supabase
      .from("expenses")
      .select("*")
      .eq(
        "expense_date",
        today
      );

    const {
      data: reconciliationData,
    } = await supabase
      .from(
        "reconciliations"
      )
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    setSales(
      salesData || []
    );

    setExpenses(
      expenseData || []
    );

    setHistory(
      reconciliationData || []
    );
  }

  const cashSales =
    sales
      .filter(
        (sale) =>
          sale.payment_method ===
          "Cash"
      )
      .reduce(
        (sum, sale) =>
          sum +
          Number(sale.total),
        0
      );

  const mpesaSales =
    sales
      .filter(
        (sale) =>
          sale.payment_method ===
          "MPESA"
      )
      .reduce(
        (sum, sale) =>
          sum +
          Number(sale.total),
        0
      );

  const cardSales =
    sales
      .filter(
        (sale) =>
          sale.payment_method ===
          "Card"
      )
      .reduce(
        (sum, sale) =>
          sum +
          Number(sale.total),
        0
      );

  const todayExpenses =
    expenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount
        ),
      0
    );

  const expectedCash =
    cashSales -
    todayExpenses;

  const variance =
    Number(countedCash || 0) -
    expectedCash;

  async function saveReconciliation() {

    await supabase
      .from(
        "reconciliations"
      )
      .insert({
        reconciliation_date:
          new Date()
            .toISOString()
            .split("T")[0],

        expected_cash:
          expectedCash,

        counted_cash:
          Number(
            countedCash
          ),

        variance,

        notes,
      });

    setCountedCash("");
    setNotes("");

    loadData();
  }

  return (
    <PermissionGuard permission="reconciliation">

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">
          Cash Reconciliation
        </h1>

        <div className="grid md:grid-cols-4 gap-4 mb-6">

          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-bold">
              Cash Sales
            </h3>
            <div className="text-2xl">
              KES {cashSales}
            </div>
          </div>

          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-bold">
              MPESA Sales
            </h3>
            <div className="text-2xl">
              KES {mpesaSales}
            </div>
          </div>

          <div className="bg-yellow-100 p-4 rounded-lg">
            <h3 className="font-bold">
              Card Sales
            </h3>
            <div className="text-2xl">
              KES {cardSales}
            </div>
          </div>

          <div className="bg-red-100 p-4 rounded-lg">
            <h3 className="font-bold">
              Expenses
            </h3>
            <div className="text-2xl">
              KES {todayExpenses}
            </div>
          </div>

        </div>

        <div className="bg-white border rounded-lg p-6 mb-6">

          <h2 className="text-xl font-bold mb-4">
            Shift Closing
          </h2>

          <div className="mb-4">

            <strong>
              Expected Cash:
            </strong>

            {" "}

            KES {expectedCash}

          </div>

          <input
            type="number"
            placeholder="Actual Cash Counted"
            value={countedCash}
            onChange={(e) =>
              setCountedCash(
                e.target.value
              )
            }
            className="border p-2 w-full mb-3"
          />

          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }
            className="border p-2 w-full mb-3"
          />

          <div
            className={`font-bold text-xl mb-4 ${
              variance === 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >

            Variance:
            {" "}
            KES {variance}

          </div>

          <button
            onClick={
              saveReconciliation
            }
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Close Shift
          </button>

        </div>

        <table className="w-full border">

          <thead>

            <tr className="bg-slate-100">

              <th className="p-2">
                Date
              </th>

              <th className="p-2">
                Expected
              </th>

              <th className="p-2">
                Counted
              </th>

              <th className="p-2">
                Variance
              </th>

              <th className="p-2">
                Notes
              </th>

            </tr>

          </thead>

          <tbody>

            {history.map(
              (row) => (

                <tr
                  key={row.id}
                  className="border-t"
                >

                  <td className="p-2">
                    {
                      row.reconciliation_date
                    }
                  </td>

                  <td className="p-2">
                    KES {row.expected_cash}
                  </td>

                  <td className="p-2">
                    KES {row.counted_cash}
                  </td>

                  <td
                    className={`p-2 font-bold ${
                      row.variance === 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    KES {row.variance}
                  </td>

                  <td className="p-2">
                    {row.notes}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </PermissionGuard>
  );
}