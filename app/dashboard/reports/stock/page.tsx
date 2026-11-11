"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ReportActions from "@/components/ReportActions";
import { exportReportPDF } from "@/lib/exportReportPDF";

export default function StockReportPage() {

  const [stockEntries, setStockEntries] =
    useState<any[]>([]);

  const [issuances, setIssuances] =
    useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    const { data: stockData } =
      await supabase
        .from("stock_entries")
        .select("*")
        .order("item_name");

    const { data: issueData } =
      await supabase
        .from("stock_issuance")
        .select("*");

    setStockEntries(
      stockData || []
    );

    setIssuances(
      issueData || []
    );
  }

  function getIssuedQty(
    itemName: string
  ) {

    return issuances
      .filter(
        (issue) =>
          issue.item_name ===
          itemName
      )
      .reduce(
        (sum, issue) =>
          sum +
          Number(issue.quantity),
        0
      );
  }

  function getBalance(
    itemName: string,
    purchasedQty: number
  ) {

    return (
      purchasedQty -
      getIssuedQty(itemName)
    );
  }

  const totalItems =
    stockEntries.length;

  const totalBalance =
    stockEntries.reduce(
      (sum, item) =>
        sum +
        getBalance(
          item.item_name,
          Number(item.quantity)
        ),
      0
    );

  const lowStockCount =
    stockEntries.filter(
      (item) =>
        getBalance(
          item.item_name,
          Number(item.quantity)
        ) <= 5
    ).length;

function exportStockPDF() {

  const rows =
    stockEntries.map(
      (item) => [

        item.item_name,

        item.quantity,

        getIssuedQty(
          item.item_name
        ),

        getBalance(
          item.item_name,
          Number(
            item.quantity
          )
        ),

      ]
    );

  exportReportPDF(
    "Stock Report",
    [
      "Item",
      "Purchased",
      "Issued",
      "Balance",
    ],
    rows
  );
}

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Stock Report
      </h1>
<ReportActions
  reportId="stock-report"
  fileName="Stock Report"
  onExportPDF={
    exportStockPDF
  }
/>

<div id="stock-report">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-blue-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Stock Items
          </h2>

          <div className="text-3xl">
            {totalItems}
          </div>

        </div>

        <div className="bg-green-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Total Balance
          </h2>

          <div className="text-3xl">
            {totalBalance}
          </div>

        </div>

        <div className="bg-red-100 p-4 rounded-lg">

          <h2 className="font-bold">
            Low Stock Items
          </h2>

          <div className="text-3xl">
            {lowStockCount}
          </div>

        </div>

      </div>

      {lowStockCount > 0 && (

        <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">

          <h2 className="font-bold text-red-700 mb-2">
            Low Stock Alerts
          </h2>

          <ul className="space-y-1">

            {stockEntries
              .filter(
                (item) =>
                  getBalance(
                    item.item_name,
                    Number(
                      item.quantity
                    )
                  ) <= 5
              )
              .map((item) => (

                <li
                  key={item.id}
                  className="text-red-600"
                >

                  {item.item_name}
                  {" - "}
                  Balance:
                  {" "}
                  {getBalance(
                    item.item_name,
                    Number(
                      item.quantity
                    )
                  )}

                </li>

              ))}

          </ul>

        </div>

      )}

      <table className="w-full border">

        <thead>

          <tr className="bg-slate-100">

            <th className="p-2 text-left">
              Item
            </th>

            <th className="p-2 text-left">
              Purchased
            </th>

            <th className="p-2 text-left">
              Issued
            </th>

            <th className="p-2 text-left">
              Balance
            </th>

            <th className="p-2 text-left">
              Supplier
            </th>

          </tr>

        </thead>

        <tbody>

          {stockEntries.map(
            (item) => (

              <tr
                key={item.id}
                className="border-t"
              >

                <td className="p-2">
                  {item.item_name}
                </td>

                <td className="p-2">
                  {item.quantity}
                </td>

                <td className="p-2">

                  {getIssuedQty(
                    item.item_name
                  )}

                </td>

                <td
                  className={`p-2 font-bold ${
                    getBalance(
                      item.item_name,
                      Number(
                        item.quantity
                      )
                    ) <= 5
                      ? "text-red-600"
                      : "text-green-700"
                  }`}
                >

                  {getBalance(
                    item.item_name,
                    Number(
                      item.quantity
                    )
                  )}

                </td>

                <td className="p-2">
                  {item.supplier}
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