"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ReportActions from "@/components/ReportActions";
import { exportReportPDF } from "@/lib/exportReportPDF";

export default function ExpenseReportPage() {
  const [expenses, setExpenses] =
    useState<any[]>([]);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {

    let query = supabase
      .from("expenses")
      .select("*")
      .order("expense_date", {
        ascending: false,
      });

    if (startDate) {
      query = query.gte(
        "expense_date",
        startDate
      );
    }

    if (endDate) {
      query = query.lte(
        "expense_date",
        endDate
      );
    }

    const { data } =
      await query;

    setExpenses(data || []);
  }

  const totalExpenses =
    expenses.reduce(
      (sum, expense) =>
        sum +
        Number(expense.amount),
      0
    );

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const todayExpenses =
    expenses
      .filter(
        (expense) =>
          expense.expense_date ===
          today
      )
      .reduce(
        (sum, expense) =>
          sum +
          Number(expense.amount),
        0
      );

  const averageExpense =
    expenses.length > 0
      ? Math.round(
          totalExpenses /
            expenses.length
        )
      : 0;

function exportExpensePDF() {

  const rows =
    expenses.map(
      (expense) => [

        expense.description,

        expense.amount,

        expense.expense_date,

      ]
    );

  exportReportPDF(
    "Expense Report",
    [
      "Description",
      "Amount",
      "Date",
    ],
    rows
  );
}

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Expense Report
      </h1>

    <ReportActions
  reportId="expense-report"
  fileName="Expense Report"
  onExportPDF={
    exportExpensePDF
  }
/>

<div id="expense-report">

      <div className="flex gap-4 mb-6">

        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            setStartDate(
              e.target.value
            )
          }
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            setEndDate(
              e.target.value
            )
          }
          className="border p-2 rounded"
        />

        <button
          onClick={loadExpenses}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filter
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-red-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Total Expenses
          </h2>

          <div className="text-3xl">
            KES {totalExpenses}
          </div>

        </div>

        <div className="bg-yellow-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Today's Expenses
          </h2>

          <div className="text-3xl">
            KES {todayExpenses}
          </div>

        </div>

        <div className="bg-indigo-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Average Expense
          </h2>

          <div className="text-3xl">
            KES {averageExpense}
          </div>

        </div>

      </div>

      <table className="w-full border">

        <thead>

          <tr className="bg-slate-100">

            <th className="p-2 text-left">
              Description
            </th>

            <th className="p-2 text-left">
              Amount
            </th>

            <th className="p-2 text-left">
              Date
            </th>

          </tr>

        </thead>

        <tbody>

          {expenses.map(
            (expense) => (

              <tr
                key={expense.id}
                className="border-t"
              >

                <td className="p-2">
                  {
                    expense.description
                  }
                </td>

                <td className="p-2">
                  KES {expense.amount}
                </td>

                <td className="p-2">
                  {
                    expense.expense_date
                  }
                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
    </div>
  );
}