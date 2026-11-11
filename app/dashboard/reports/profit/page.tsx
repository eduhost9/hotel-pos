"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ReportActions from "@/components/ReportActions";
import { exportReportPDF } from "@/lib/exportReportPDF";

export default function ProfitReportPage() {
  const [sales, setSales] =
    useState<any[]>([]);

  const [expenses, setExpenses] =
    useState<any[]>([]);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    let salesQuery = supabase
      .from("sales")
      .select("*");

    let expensesQuery =
      supabase
        .from("expenses")
        .select("*");

    if (startDate) {

      salesQuery =
        salesQuery.gte(
          "created_at",
          startDate
        );

      expensesQuery =
        expensesQuery.gte(
          "expense_date",
          startDate
        );
    }

    if (endDate) {

      salesQuery =
        salesQuery.lte(
          "created_at",
          endDate + "T23:59:59"
        );

      expensesQuery =
        expensesQuery.lte(
          "expense_date",
          endDate
        );
    }

    const { data: salesData } =
      await salesQuery;

    const {
      data: expenseData,
    } = await expensesQuery;

    setSales(
      salesData || []
    );

    setExpenses(
      expenseData || []
    );
  }

  const totalSales =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(sale.total),
      0
    );

  const totalExpenses =
    expenses.reduce(
      (sum, expense) =>
        sum +
        Number(expense.amount),
      0
    );

  const netProfit =
    totalSales -
    totalExpenses;

  const profitMargin =
    totalSales > 0
      ? (
          (netProfit /
            totalSales) *
          100
        ).toFixed(1)
      : 0;

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const todaySales =
    sales
      .filter(
        (sale) =>
          sale.created_at?.startsWith(
            today
          )
      )
      .reduce(
        (sum, sale) =>
          sum +
          Number(sale.total),
        0
      );

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

  const todayProfit =
    todaySales -
    todayExpenses;

function exportProfitPDF() {

  exportReportPDF(
    "Profit Report",
    [
      "Metric",
      "Value",
    ],
    [
      [
        "Revenue",
        totalSales,
      ],
      [
        "Expenses",
        totalExpenses,
      ],
      [
        "Net Profit",
        netProfit,
      ],
      [
        "Profit Margin",
        `${profitMargin}%`,
      ],
    ]
  );
}

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Profit Report
      </h1>

<ReportActions
  reportId="profit-report"
  fileName="Profit Report"
  onExportPDF={
    exportProfitPDF
  }
/>

<div id="profit-report">
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
          onClick={loadData}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filter
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-green-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Revenue
          </h2>

          <div className="text-3xl">
            KES {totalSales}
          </div>

        </div>

        <div className="bg-red-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Expenses
          </h2>

          <div className="text-3xl">
            KES {totalExpenses}
          </div>

        </div>

        <div className="bg-blue-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Net Profit
          </h2>

          <div
            className={`text-3xl font-bold ${
              netProfit >= 0
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            KES {netProfit}
          </div>

        </div>

        <div className="bg-yellow-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Profit Margin
          </h2>

          <div className="text-3xl">
            {profitMargin}%
          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-green-50 border p-4 rounded-lg">

          <h3 className="font-bold">
            Today's Sales
          </h3>

          <div className="text-2xl">
            KES {todaySales}
          </div>

        </div>

        <div className="bg-red-50 border p-4 rounded-lg">

          <h3 className="font-bold">
            Today's Expenses
          </h3>

          <div className="text-2xl">
            KES {todayExpenses}
          </div>

        </div>

        <div className="bg-blue-50 border p-4 rounded-lg">

          <h3 className="font-bold">
            Today's Profit
          </h3>

          <div
            className={`text-2xl font-bold ${
              todayProfit >= 0
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            KES {todayProfit}
          </div>

        </div>

      </div>

      <table className="w-full border">

        <thead>

          <tr className="bg-slate-100">

            <th className="p-2 text-left">
              Metric
            </th>

            <th className="p-2 text-left">
              Value
            </th>

          </tr>

        </thead>

        <tbody>

          <tr className="border-t">
            <td className="p-2">
              Total Sales
            </td>

            <td className="p-2">
              KES {totalSales}
            </td>
          </tr>

          <tr className="border-t">
            <td className="p-2">
              Total Expenses
            </td>

            <td className="p-2">
              KES {totalExpenses}
            </td>
          </tr>

          <tr className="border-t bg-green-50">

            <td className="p-2 font-bold">
              Net Profit
            </td>

            <td className="p-2 font-bold">
              KES {netProfit}
            </td>

          </tr>

          <tr className="border-t">

            <td className="p-2">
              Profit Margin
            </td>

            <td className="p-2">
              {profitMargin}%
            </td>

          </tr>

        </tbody>

      </table>

    </div>
    </div>
  );
}