"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ReportActions
from "@/components/ReportActions";
import {
  exportReportPDF,
} from "@/lib/exportReportPDF";


export default function CashierPerformancePage() {

  const [sales, setSales] =
    useState<any[]>([]);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {

    const { data } =
      await supabase
        .from("sales")
        .select(`
          *,
          users (
            full_name
          )
        `)
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    setSales(data || []);
  }

  const cashierSummary =
    sales.reduce(
      (acc: any, sale: any) => {

        const cashier =
          sale.users?.full_name ||
          "Unknown";

        if (!acc[cashier]) {

          acc[cashier] = {
            name: cashier,
            sales: 0,
            transactions: 0,
          };
        }

        acc[cashier].sales +=
          Number(sale.total);

        acc[cashier]
          .transactions += 1;

        return acc;

      },
      {}
    );

  const cashiers =
    Object.values(
      cashierSummary
    ) as any[];

  const totalRevenue =
    cashiers.reduce(
      (sum, cashier) =>
        sum +
        cashier.sales,
      0
    );

  const totalTransactions =
    cashiers.reduce(
      (sum, cashier) =>
        sum +
        cashier.transactions,
      0
    );

  const topCashier =
    cashiers.length > 0
      ? [...cashiers].sort(
          (a, b) =>
            b.sales - a.sales
        )[0]
      : null;

function exportCashierPDF() {

  const rows =
    cashiers
      .sort(
        (a, b) =>
          b.sales - a.sales
      )
      .map(
        (cashier) => [

          cashier.name,

          cashier.transactions,

          cashier.sales,

          Math.round(
            cashier.sales /
            cashier.transactions
          ),

        ]
      );

  exportReportPDF(
    "Cashier Performance Report",
    [
      "Cashier",
      "Transactions",
      "Sales",
      "Average Sale",
    ],
    rows
  );
}

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Cashier Performance Report
      </h1>

    <ReportActions
  reportId="cashier-report"
  fileName="Cashier Performance Report"
  onExportPDF={
    exportCashierPDF
  }
/>

  <div id="cashier-report">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-blue-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Total Revenue
          </h2>

          <div className="text-3xl">
            KES{" "}
            {totalRevenue.toLocaleString()}
          </div>

        </div>

        <div className="bg-green-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Transactions
          </h2>

          <div className="text-3xl">
            {totalTransactions}
          </div>

        </div>

        <div className="bg-yellow-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Top Cashier
          </h2>

          <div className="text-xl font-bold">

            {topCashier
              ? topCashier.name
              : "N/A"}

          </div>

          {topCashier && (
            <div className="mt-2">

              KES{" "}
              {topCashier.sales.toLocaleString()}

            </div>
          )}

        </div>

      </div>

      <table className="w-full border">

        <thead>

          <tr className="bg-slate-100">

            <th className="p-2 text-left">
              Cashier
            </th>

            <th className="p-2 text-left">
              Transactions
            </th>

            <th className="p-2 text-left">
              Sales
            </th>

            <th className="p-2 text-left">
              Average Sale
            </th>

          </tr>

        </thead>

        <tbody>

          {cashiers
            .sort(
              (a, b) =>
                b.sales - a.sales
            )
            .map(
              (cashier) => (

                <tr
                  key={cashier.name}
                  className="border-t"
                >

                  <td className="p-2 font-semibold">
                    {cashier.name}
                  </td>

                  <td className="p-2">
                    {
                      cashier.transactions
                    }
                  </td>

                  <td className="p-2">
                    KES{" "}
                    {cashier.sales.toLocaleString()}
                  </td>

                  <td className="p-2">

                    KES{" "}

                    {Math.round(
                      cashier.sales /
                        cashier.transactions
                    ).toLocaleString()}

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